import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('songs/:songId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 💬 Yorum ekle
  @Post()
  @ApiBody({ type: CreateCommentDto })
  async addComment(
    @Param('songId') songId: string,
    @Body() dto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentsService.create(req.user.userId, songId, dto.text);
  }

  // 🎧 Şarkıya ait tüm yorumları getir
  @Get()
  async getComments(@Param('songId') songId: string,
  @Query('page') page = 1,
  @Query('limit') limit = 10,
) {
    return this.commentsService.getCommentsForSong(songId,Number(page), Number(limit));
  }

  // 🗑️ Yorumu sil
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    return this.commentsService.deleteComment(commentId, req.user.userId);
  }
}
