import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { SongsModule } from '../songs/songs.module';
import { CommentsModule } from '../comments/comments.module';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [UsersModule, SongsModule, CommentsModule, LikesModule],
  controllers: [AdminController],
})
export class AdminModule {}
