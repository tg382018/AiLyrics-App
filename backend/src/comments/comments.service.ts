import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './comment.schema';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  // ✅ Yeni yorum oluşturma
  async create(userId: string, songId: string, text: string) {
    const comment = new this.commentModel({
      user: new Types.ObjectId(userId),
      song: new Types.ObjectId(songId),
      text,
    });
    return comment.save();
  }

  // ✅ Global Pagination DTO ile yorumları listeleme
  async getCommentsForSong(songId: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
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

  // ✅ Yorum silme (admin veya kendi yorumu)
  async deleteComment(commentId: string, userId?: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new ForbiddenException('Yorum bulunamadı.');

    if (userId && comment.user.toString() !== userId.toString()) {
      throw new ForbiddenException('Bu yorumu silme yetkiniz yok.');
    }

    await comment.deleteOne();
    return { message: 'Yorum silindi 🗑️' };
  }

  // ✅ Toplam yorum sayısı (istatistik için)
  async countComments(): Promise<number> {
    return this.commentModel.countDocuments();
  }

  // ✅ Belirli bir kullanıcının yorumlarını çek (pagination dahil)
  async findByUser(userId: string, pagination?: PaginationDto) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.commentModel
        .find({ user: new Types.ObjectId(userId) })
        .populate('song', 'title createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.commentModel.countDocuments({ user: new Types.ObjectId(userId) }),
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
}
