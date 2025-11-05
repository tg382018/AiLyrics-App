import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  // ✅ Login öncesi kullanıcıyı doğrula
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı.');
    }
    // ✅ Yeni eklendi: Email doğrulanmamışsa girişe izin verme
    if (!user.isVerified) {
      throw new UnauthorizedException(
        'E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }

    const { password: _, ...result } = user.toObject();
    return result;
  }

  // ✅ Token oluşturma
  async login(user: any) {
    console.log('🧩 Signing token with secret:', process.env.JWT_SECRET);
    const payload = { email: user.email, sub: user._id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
