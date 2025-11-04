import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song } from './song.schema';
import { GenerateSongDto } from './dto/generate-song.dto';
import { CreateSongDto } from './dto/create-song.dto';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class SongsService {
  constructor(
    @InjectModel(Song.name) private songModel: Model<Song>,
    private readonly llmService: LlmService, // 💡 eklendi
  ) {}

  async create(songData: CreateSongDto): Promise<Song> {
    const newSong = new this.songModel(songData);
    return newSong.save();
  }

  async findAll(): Promise<Song[]> {
    return this.songModel.find().sort({ createdAt: -1 }).exec();
  }

  async generateSong(dto: GenerateSongDto, userId: string): Promise<Song> {
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

    // 🧠 LLM servisini çağır
    const lyrics = await this.llmService.generateSongLyrics(prompt);

    // 💾 DB'ye kaydet
    const newSong = new this.songModel({
      ...dto,
      lyrics,
      createdBy: userId,
    });

    return newSong.save();
  }
}
