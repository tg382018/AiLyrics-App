import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromptHistory } from './prompt-history.schema';

@Injectable()
export class PromptsService {
  constructor(
    @InjectModel(PromptHistory.name)
    private promptModel: Model<PromptHistory>,
  ) {}

  async savePrompt(userId: string, prompt: string, songId: string) {
    const newPrompt = new this.promptModel({ userId, prompt, song: songId });
    return newPrompt.save();
  }

  async getUserPrompts(userId: string) {
    return this.promptModel
      .find({ userId })
      .populate('song', 'title lyrics genre mood language createdAt') // 👈 şarkı detaylarını getir
      .sort({ createdAt: -1 })
      .exec();
  }
}
