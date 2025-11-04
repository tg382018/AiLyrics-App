import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class GenerateSongDto {
  @ApiProperty({ example: 'Rain of Love', description: 'Şarkının başlığı' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Aşk', description: 'Şarkının konusu' })
  @IsString()
  topic: string;

  @ApiProperty({ example: 'Romantik', description: 'Şarkının ruh hali' })
  @IsString()
  mood: string;

  @ApiProperty({ example: 'Pop', description: 'Tür' })
  @IsString()
  genre: string;

  @ApiProperty({ example: 'English', description: 'Dil' })
  @IsString()
  language: string;

  @ApiProperty({ example: '80\'ler', description: 'Dönem' })
  @IsString()
  era: string;

  @ApiProperty({ example: '3 verse + chorus', description: 'Yapı' })
  @IsString()
  verses: string;

  @ApiProperty({ example: 8, description: 'Yaratıcılık (1-10)' })
  @IsNumber()
  creativity: number;
}
