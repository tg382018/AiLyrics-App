import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from './song.schema';
import { LlmModule } from '../llm/llm.module'; // 💡 eklendi
import { PromptsModule } from 'src/prompts/prompts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
    LlmModule,
        PromptsModule, // 💡 burada da import et
  ],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
