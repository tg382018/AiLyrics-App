import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Song } from './song.schema';
import { GenerateSongDto } from './dto/generate-song.dto';
import { CreateSongDto } from './dto/create-song.dto';
import { LlmService } from '../llm/llm.service';
import { PromptsService } from '../prompts/prompts.service'; // 💡 eklendi
import { User } from '../users/users.schema'; // üst kısma ekle

@Injectable()
export class SongsService {
  constructor(
    @InjectModel(Song.name) private songModel: Model<Song>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly llmService: LlmService,
    private readonly promptsService: PromptsService, // 💡 eklendi
  ) {}

  private toSongResponse(song: any) {
    if (!song) return null;

    let createdBy: any = song.createdBy;

    if (createdBy instanceof Types.ObjectId) {
      createdBy = createdBy.toString();
    } else if (createdBy && typeof createdBy === 'object') {
      createdBy = {
        _id: createdBy._id?.toString?.() ?? createdBy._id,
        username: createdBy.username,
        email: createdBy.email,
      };
    }

    const prompt =
      song.prompt && typeof song.prompt === 'object' && 'prompt' in song.prompt
        ? {
            _id: song.prompt._id?.toString?.() ?? song.prompt._id,
            prompt: song.prompt.prompt,
            createdAt: song.prompt.createdAt,
          }
        : song.prompt;

    return {
      ...song,
      _id: song._id?.toString?.() ?? song._id,
      createdBy,
      prompt,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
    };
  }

  // 🎵 Manuel şarkı ekleme
  async create(songData: CreateSongDto & { createdBy: string }): Promise<any> {
    const ownerId = Types.ObjectId.isValid(songData.createdBy)
      ? new Types.ObjectId(songData.createdBy)
      : songData.createdBy;

    const newSong = new this.songModel({
      ...songData,
      createdBy: ownerId,
    });
    const saved = await newSong.save();

    await saved.populate('createdBy', 'username email');

    return this.toSongResponse(saved.toObject());
  }

  // 🎶 Tüm şarkıları getir
  async findAll(page = 1, limit = 10): Promise<{ data: any[]; pagination: any }> {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const skip = (safePage - 1) * safeLimit;

    const [songs, total] = await Promise.all([
      this.songModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate('prompt')
        .lean()
        .exec(),
      this.songModel.countDocuments(),
    ]);

    await this.attachUsers(songs);

    return {
      data: songs.map((song) => this.toSongResponse(song)),
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1,
      },
    };
  }

  // 🧠 AI destekli şarkı üretme
  async generateSong(dto: GenerateSongDto, userId: string): Promise<any> {
    // 🔒 Günlük limit kontrolü
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount = await this.songModel.countDocuments({
      createdBy: new Types.ObjectId(userId), // 🔥 string değil ObjectId
      createdAt: { $gte: startOfDay },
    });

    if (todayCount >= 3) {
      throw new ForbiddenException('You reached a daily limit of 3 songs.');
    }

    // ✨ Prompt oluştur
    const prompt = `
    Write a ${dto.genre} song in ${dto.language}.
    Title: ${dto.title}
    Topic: ${dto.topic}
    Mood: ${dto.mood}
    Era: ${dto.era}
    Structure: ${dto.verses}
    Creativity level: ${dto.creativity}/10.
    Include verses and a chorus.
    `;

    // 🤖 LLM servisiyle şarkı sözü üret
    const lyrics = await this.llmService.generateSongLyrics(prompt);

    // 💾 Şarkıyı kaydet
    const ownerId = Types.ObjectId.isValid(userId)
      ? new Types.ObjectId(userId)
      : userId;

    const newSong = new this.songModel({
      ...dto,
      lyrics,
      createdBy: ownerId,
    });
    const savedSong = await newSong.save();

    // 🧾 Prompt’u kaydet (ilişkisel)
    const promptRecord = await this.promptsService.savePrompt(
      userId,
      prompt,
      (savedSong._id as unknown as string),
    );

    // 🔗 Şarkıya prompt referansını ekle
    savedSong.prompt = promptRecord._id as any;
    await savedSong.save();

    await savedSong.populate('createdBy', 'username email');
    await savedSong.populate('prompt');

    return this.toSongResponse(savedSong.toObject());
  }

  async findByUser(userId: string | Types.ObjectId, page = 1, limit = 10) {
    if (!userId) {
      throw new ForbiddenException('User id missing from request context.');
    }

    const ownerCandidates: Array<string | Types.ObjectId> = [];

    if (typeof userId === 'string') {
      ownerCandidates.push(userId);
      if (Types.ObjectId.isValid(userId)) {
        ownerCandidates.push(new Types.ObjectId(userId));
      }
    } else if (userId instanceof Types.ObjectId) {
      ownerCandidates.push(userId);
      ownerCandidates.push(userId.toString());
    }

    if (ownerCandidates.length === 0) {
      throw new ForbiddenException('Unable to resolve user identifier.');
    }

    const match: Record<string, any> = ownerCandidates.length > 1
      ? { createdBy: { $in: ownerCandidates } }
      : { createdBy: ownerCandidates[0] };

    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const skip = (safePage - 1) * safeLimit;

    const [songs, total] = await Promise.all([
      this.songModel
        .find(match)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate('prompt')
        .lean()
        .exec(),
      this.songModel.countDocuments(match),
    ]);

    await this.attachUsers(songs);

    return {
      data: songs.map((song) => this.toSongResponse(song)),
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1,
      },
    };
  }

  async findPopular(): Promise<any[]> {
    const songs = await this.songModel
      .find()
      .sort({ likeCount: -1 })
      .limit(10)
      .lean()
      .exec();

    await this.attachUsers(songs);

    return songs.map((song) => ({
      id: song._id?.toString?.() ?? song._id,
      title: song.title,
      likeCount: song.likeCount ?? 0,
      mood: song.mood ?? 'Unknown',
      genre: song.genre ?? 'Unknown',
      createdAt: song.createdAt,
      createdBy: typeof song.createdBy === 'object'
        ? {
            id: song.createdBy?._id?.toString?.(),
            username: song.createdBy?.username || 'Anonymous',
            email: song.createdBy?.email,
          }
        : { username: 'Anonymous' },
    }));
  }

  async findById(id: string) {
    const song = await this.songModel
      .findById(id)
      .populate('prompt')
      .lean()
      .exec();

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    await this.attachUsers([song]);

    return this.toSongResponse(song);
  }

  async countSongs(): Promise<number> {
    return this.songModel.countDocuments();
  }

  async getUserSongCounts() {
    const results = await this.songModel.aggregate([
      {
        $group: {
          _id: '$createdBy',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          username: '$user.username',
          email: '$user.email',
          songCount: '$count',
        },
      },
    ]);

    return results;
  }

  private async attachUsers(records: any[]) {
    const candidateIds = records
      .map((record) => record.createdBy)
      .filter((value) => typeof value === 'string' || value instanceof Types.ObjectId)
      .map((value) => value.toString())
      .filter((value) => Types.ObjectId.isValid(value));

    if (candidateIds.length === 0) return;

    const uniqueIds = Array.from(new Set(candidateIds)).map((id) => new Types.ObjectId(id));
    const users = await this.userModel
      .find({ _id: { $in: uniqueIds } })
      .select('username email')
      .lean()
      .exec();

    const map = new Map(users.map((user) => [user._id.toString(), user]));

    records.forEach((record) => {
      const key = record.createdBy?.toString?.() ?? record.createdBy;
      if (key && map.has(key)) {
        record.createdBy = map.get(key);
      }
    });
  }
}
