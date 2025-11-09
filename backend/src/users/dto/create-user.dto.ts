import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'tahsin', description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'tahsin@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;
}
