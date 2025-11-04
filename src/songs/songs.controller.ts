import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { GenerateSongDto } from './dto/generate-song.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  // 🎵 Manuel şarkı oluşturma
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('create')
  @ApiBody({ type: CreateSongDto })
  async createSong(@Body() songData: CreateSongDto, @Request() req) {
    return this.songsService.create({
      ...songData,
      createdBy: req.user.userId,
    });
  }

  // 📜 Tüm şarkıları getir
  @Get()
  async getAllSongs() {
    return this.songsService.findAll();
  }

  // 🤖 AI ile şarkı oluşturma
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('generate') // <-- 🔥 Eksik olan dekoratör
  @ApiBody({ type: GenerateSongDto })
  async generateSong(@Body() dto: GenerateSongDto, @Request() req) {
    return this.songsService.generateSong(dto, req.user.userId);
  }

    // ✅ 🔥 Kullanıcının kendi şarkıları
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('my')
  async getMySongs(@Request() req) {
    return this.songsService.findByUser(req.user.userId);
  }
}
