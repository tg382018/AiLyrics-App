import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateSongLyrics(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [{ role: 'user', content: prompt }],
      });

      const lyrics =
        response.choices?.[0]?.message?.content?.trim() ||
        'Lyrics could not be generated.';

      return lyrics;
    } catch (error) {
      this.logger.error('❌ OpenAI API error:', error);
      throw new InternalServerErrorException('AI yanıtı alınamadı.');
    }
  }
}
