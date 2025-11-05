import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateSongDto {
  @ApiProperty({ example: 'Deneme Şarkı', description: 'Şarkının başlığı' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Bu bir test şarkısıdır...', description: 'Şarkı sözleri' })
  @IsString()
  lyrics: string;

  @ApiProperty({ example: 'Aşk', description: 'Şarkının konusu' })
  @IsString()
  topic: string;

  @ApiProperty({ example: 'Romantik', description: 'Şarkının duygusal tonu' })
  @IsString()
  mood: string;

  @ApiProperty({ example: 'Pop', description: 'Şarkı türü' })
  @IsString()
  genre: string;

  @ApiProperty({ example: 'Türkçe', description: 'Şarkının dili' })
  @IsString()
  language: string;

  @ApiProperty({ example: 'Kafiye Ağırlıklı', description: 'Yazım tarzı' })
  @IsString()
  style: string;

  @ApiProperty({ example: "80'ler", description: 'Hangi döneme ait' })
  @IsString()
  era: string;

  @ApiProperty({ example: '3 kıta + nakarat', description: 'Kıta yapısı' })
  @IsString()
  verses: string;

  @ApiProperty({ example: 8, description: 'Yaratıcılık seviyesi (1-10 arası)' })
  @IsNumber()
  creativity: number;

  @ApiProperty({ example: 'user123', required: false, description: 'Kullanıcı ID (isteğe bağlı)' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
