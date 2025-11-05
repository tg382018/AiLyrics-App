import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './comment.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async create(userId: string, songId: string, text: string) {
    const comment = new this.commentModel({
      user: new Types.ObjectId(userId),
      song: new Types.ObjectId(songId),
      text,
    });
    return comment.save();
  }

async getCommentsForSong(songId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    this.commentModel
      .find({ song: new Types.ObjectId(songId) })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    this.commentModel.countDocuments({ song: new Types.ObjectId(songId) }),
  ]);

  return {
    data: comments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async deleteComment(commentId: string, userId?: string) {
  const comment = await this.commentModel.findById(commentId);
  if (!comment) throw new ForbiddenException('Yorum bulunamadı.');

  // Eğer userId varsa (normal kullanıcı ise) sadece kendi yorumunu silebilir
  if (userId && comment.user.toString() !== userId.toString()) {
    throw new ForbiddenException('Bu yorumu silme yetkiniz yok.');
  }

  await comment.deleteOne();
  return { message: 'Yorum silindi 🗑️' };
}

async countComments(): Promise<number> {
  return this.commentModel.countDocuments();
}

  async findByUser(userId: string) {
  return this.commentModel
    .find({ user: new Types.ObjectId(userId) })
    .populate('song', 'title createdAt') // şarkı başlığı ve tarihi göster
    .sort({ createdAt: -1 })
    .exec();
}

}
