import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'tahsin@example.com', description: 'Email adresi' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Kullanıcı şifresi' })
  @IsString()
  password: string;
}
