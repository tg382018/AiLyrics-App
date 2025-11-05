import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'tahsin', description: 'Kullanıcı adı' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'tahsin@example.com', description: 'Email adresi' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Şifre (min 6 karakter)' })
  @IsString()
  @MinLength(6)
  password: string;
}
