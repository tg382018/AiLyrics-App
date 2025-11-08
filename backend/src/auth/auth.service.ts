import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
 
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,

    // 🔹 Mongoose modelini inject ediyoruz
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // ✅ Normal login
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı.');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin.',
      );
    }

    // 🧩 password opsiyonel olduğu için null check yapıyoruz
    if (!user.password) {
      throw new UnauthorizedException('Bu hesap sadece Google ile giriş yapabilir.');
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
    const payload = { email: user.email, sub: user._id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  // ✅ Google login
  async googleLogin(googleUser: any) {
    const { email, name, picture, id: googleId } = googleUser;

    // 🔍 Kullanıcı var mı kontrol et (hem email hem googleId)
    let user = await this.userModel.findOne({
      $or: [{ email }, { googleId }],
    });

    if (!user) {
      // 👤 Yeni kullanıcı oluştur
      user = new this.userModel({
        email,
        username: name || email.split('@')[0],
        googleId,
        profileImage: picture || null,
        role: 'user',
        provider: 'google',
        isVerified: true, // Google kullanıcıları otomatik verified
      });
      await user.save();
    }

    // 🔑 JWT oluştur
    const payload = { email: user.email, sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload);

    // 🎯 Frontend'e dön
    return {
      message: 'Google login successful',
      token,
      user,
    };
  }
}
