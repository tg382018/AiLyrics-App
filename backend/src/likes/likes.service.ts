import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from './like.schema';
import { Song } from '../songs/song.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Song.name) private songModel: Model<Song>,
  ) {}

  async toggleLike(userId: string, songId: string) {
    const existing = await this.likeModel.findOne({ userId, songId });

    if (existing) {
      await this.likeModel.deleteOne({ _id: existing._id });
      await this.songModel.findByIdAndUpdate(songId, { $inc: { likeCount: -1 } });
      return { liked: false, message: 'Like kaldırıldı' };
    } else {
      await this.likeModel.create({ userId, songId });
      await this.songModel.findByIdAndUpdate(songId, { $inc: { likeCount: 1 } });
      return { liked: true, message: 'Beğenildi ❤️' };
    }
  }

  async countLikes(songId: string): Promise<number> {
    return this.likeModel.countDocuments({ songId });
  }

  async getUserLikes(userId: string) {
    return this.likeModel.find({ userId });
  }
}
