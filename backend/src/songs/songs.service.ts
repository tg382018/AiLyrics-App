import { Injectable, ForbiddenException } from '@nestjs/common';
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
    private readonly llmService: LlmService,
    private readonly promptsService: PromptsService, // 💡 eklendi
  ) {}

  // 🎵 Manuel şarkı ekleme
  async create(songData: CreateSongDto): Promise<Song> {
    const newSong = new this.songModel(songData);
    return newSong.save();
  }

  // 🎶 Tüm şarkıları getir
  async findAll(): Promise<Song[]> {
    return this.songModel.find().sort({ createdAt: -1 }).exec();
  }

  // 🧠 AI destekli şarkı üretme
  async generateSong(dto: GenerateSongDto, userId: string): Promise<Song> {
    // 🔒 Günlük limit kontrolü
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount = await this.songModel.countDocuments({
      createdBy: new Types.ObjectId(userId), // 🔥 string değil ObjectId
      createdAt: { $gte: startOfDay },
    });

    if (todayCount >= 3) {
      throw new ForbiddenException('Günlük 3 şarkı üretme limitine ulaştınız.');
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
    const newSong = new this.songModel({
      ...dto,
      lyrics,
      createdBy: userId,
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

    return savedSong;
  }

 async findByUser(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [songs, total] = await Promise.all([
    this.songModel
      .find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    this.songModel.countDocuments({ createdBy: userId }),
  ]);

  return {
    data: songs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}


async findPopular(): Promise<any[]> {
  const songs = await this.songModel
    .find()
    .sort({ likeCount: -1 })
    .limit(10)
    .populate({
      path: 'createdBy',
      model: 'User',
      select: 'username email',
    })
    .exec();

  return songs.map(song => ({
    id: song._id,
    title: song.title,
    likeCount: song.likeCount,
    mood: song.mood,
    genre: song.genre,
    createdAt: song.createdAt,
    createdBy: {
      id: song.createdBy?._id,
      username: song.createdBy?.username || 'Anonim',
      email: song.createdBy?.email,
    },
  }));
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


}
