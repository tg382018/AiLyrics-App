import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LikesService } from './likes.service';

@ApiTags('songs')
@Controller('songs')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post(':id/like')
  async toggleLike(@Param('id') songId: string, @Request() req) {
    return this.likesService.toggleLike(req.user.userId, songId);
  }
}
