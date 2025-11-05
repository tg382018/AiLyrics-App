import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './like.schema';
import { LikesService } from './likes.service';
import { SongsModule } from '../songs/songs.module';
import { Song, SongSchema } from '../songs/song.schema';
import { LikesController } from './likes.controller';
 

@Module({
  imports: [
    SongsModule,
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: Song.name, schema: SongSchema },
    ]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
