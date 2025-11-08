import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { User } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { EmailService } from '../email/email.service'; // ✅ yeni eklendi

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService, // ✅ eklendi
  ) {}

  // ✅ REGISTER (artık e-posta gönderiyor)
  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new ConflictException('Bu e-posta zaten kayıtlı.');

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString('hex');

    const newUser = new this.userModel({
      email,
      username,
      password: hashed,
      verificationToken,
    });

    const saved = await newUser.save();

    // ✅ Gerçek e-posta gönderimi
    await this.emailService.sendMail(
      saved.email,
      'AI Lyrics Hesabını Doğrula 🎵',
      `
      <h2>AI Lyrics'e Hoş Geldin </h2>
      <p>Hesabını doğrulamak için aşağıdaki bağlantıya tıkla:</p>
      <a href="http://localhost:3000/api/auth/verify?token=${verificationToken}"
         style="background:#4CAF50;color:white;padding:10px 16px;
         text-decoration:none;border-radius:6px;">Hesabımı Doğrula</a>
      <p style="margin-top:20px;">Eğer bu isteği sen yapmadıysan, bu e-postayı görmezden gel.</p>
      <br/>
      <small>AI Lyrics Ekibi 🎶</small>
      `,
    );

    return saved;
  }

   async requestPasswordReset(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('Bu e-posta adresi kayıtlı değil.');

    const resetToken = randomBytes(32).toString('hex');
    const expireMs = Number(process.env.RESET_TOKEN_EXPIRES || 900000); // 15dk fallback
    const expireDate = new Date(Date.now() + expireMs);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expireDate;
    await user.save();

    const resetUrl = `http://localhost:3000/api/auth/reset-password?token=${resetToken}`;

    await this.emailService.sendMail(
      user.email,
      '🔑 Şifre Sıfırlama Talebi',
      `
        <h2>Şifreni Sıfırlamak İçin</h2>
        <p>Aşağıdaki bağlantıya tıklayarak yeni şifreni oluşturabilirsin:</p>
        <a href="${resetUrl}"
           style="background:#2196f3;color:white;padding:10px 18px;
           text-decoration:none;border-radius:6px;">Şifremi Sıfırla</a>
        <p>Bu bağlantı 15 dakika geçerlidir.</p>
      `,
    );

    return 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.';
  }

  // ✅ Şifre Güncelleme
  async resetPassword(token: string, newPassword: string): Promise<string> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) throw new BadRequestException('Geçersiz veya süresi dolmuş bağlantı.');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return 'Şifren başarıyla güncellendi 🎉';
  }

  // ✅ Email doğrulama işlemi
  async verifyEmail(token: string): Promise<User | null> {
    const user = await this.userModel.findOne({ verificationToken: token });
    if (!user) return null;

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return user;
  }

  // ✅ Login (artık doğrulama kontrolü de var)
  async login(loginUserDto: LoginUserDto): Promise<Omit<User, 'password'>> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı.');

    if (!user.isVerified)
      throw new UnauthorizedException(
        'E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin.',
      );

      if (!user.password) {
  // Örneğin Google ile kayıt olmuş kullanıcılar
  throw new UnauthorizedException('Bu hesap için şifreli giriş yapılamaz.');
}
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Hatalı şifre.');

    const { password: _, ...result } = user.toObject() as any;
    return result;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async countUsers(): Promise<number> {
  return this.userModel.countDocuments();
}
}
