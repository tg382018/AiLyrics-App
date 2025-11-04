import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song } from './song.schema';
import { GenerateSongDto } from './dto/generate-song.dto';
import { CreateSongDto } from './dto/create-song.dto';
import { LlmService } from '../llm/llm.service';
import { PromptsService } from '../prompts/prompts.service'; // 💡 eklendi

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
      createdBy: userId,
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

  async findByUser(userId: string): Promise<Song[]> {
  return this.songModel
    .find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .exec();
}

}
