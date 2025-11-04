import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from './song.schema';
import { LlmModule } from '../llm/llm.module'; // 💡 eklendi

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
    LlmModule, // 💡 burada da import et
  ],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
