import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Bu şarkı harika olmuş 🎶' })
  @IsString()
  text: string;
}
