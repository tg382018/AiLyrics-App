import { Controller, Get, UseGuards, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from './admin.guard';
import { UsersService } from '../users/users.service';
import { SongsService } from '../songs/songs.service';
import { LikesService } from '../likes/likes.service';
import { CommentsService } from '../comments/comments.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private usersService: UsersService,
    private songsService: SongsService,
    private likesService: LikesService,
    private commentsService: CommentsService,
  ) {}

  // 👥 Tüm kullanıcıları getir
  @Get('users')
  async getUsers() {
    return this.usersService.findAll();
  }

  // 🎵 Belirli kullanıcının şarkıları
  @Get('users/:id/songs')
  async getUserSongs(@Param('id') userId: string) {
    return this.songsService.findByUser(userId);
  }

  // ❤️ Kullanıcının beğenileri
  @Get('users/:id/likes')
  async getUserLikes(@Param('id') userId: string) {
    return this.likesService.getUserLikes(userId);
  }

  // 💬 Kullanıcının yorumları
  @Get('users/:id/comments')
  async getUserComments(@Param('id') userId: string) {
    return this.commentsService.findByUser(userId);
  }

  // ❌ Yorum silme
  @Delete('comments/:id')
  async deleteComment(@Param('id') id: string) {
    return this.commentsService.deleteComment(id);
  }

  // 📊 İstatistikler
@Get('stats')
async getStats() {
  const totalUsers = await this.usersService.countUsers();
  const totalSongs = await this.songsService.countSongs();
  const totalComments = await this.commentsService.countComments();

  const userSongCounts = await this.songsService.getUserSongCounts();

  const avgSongsPerUser = (totalSongs / totalUsers).toFixed(2);

  return {
    totalUsers,
    totalSongs,
    totalComments,
    avgSongsPerUser,
    userSongCounts, // 👈 eklendi
  };
}


  
}
