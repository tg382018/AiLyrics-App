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
    if (existing) throw new ConflictException('This email is already registered.');

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString('hex');

    const newUser = new this.userModel({
      email,
      username,
      password: hashed,
      verificationToken,
    });

    const saved = await newUser.save();

    const apiBase = (
      process.env.API_BASE_URL ??
      process.env.BACKEND_URL ??
      'http://localhost:4000/api'
    ).replace(/\/$/, '');

    const verificationUrl = `${apiBase}/auth/verify?token=${verificationToken}`;

    const [primaryFrontendOrigin] = (
      process.env.FRONTEND_URL ?? 'http://localhost:3005'
    )
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
    const frontendOrigin = primaryFrontendOrigin ?? 'http://localhost:3005';

    await this.emailService.sendMail(
      saved.email,
      'Verify your AI Lyrics account 🎵',
      `
      <h2>Welcome to AI Lyrics!</h2>
      <p>Tap the button below to verify your account:</p>
      <a href="${verificationUrl}"
         style="background:#4CAF50;color:white;padding:10px 16px;
         text-decoration:none;border-radius:6px;">Verify my account</a>
      <p style="margin-top:20px;">If you did not create this account, you can safely ignore this email.</p>
      <p style="margin-top:24px;">Ready to continue?</p>
      <a href="${frontendOrigin.replace(/\/$/, '')}/app/login"
         style="display:inline-block;margin-top:8px;background:#6366f1;color:white;padding:10px 18px;
         text-decoration:none;border-radius:6px;">Go to login</a>
      <br/>
      <small>AI Lyrics Team 🎶</small>
      `,
    );

    return saved;
  }

   async requestPasswordReset(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('This email address is not registered.');

    const resetToken = randomBytes(32).toString('hex');
    const expireMs = Number(process.env.RESET_TOKEN_EXPIRES || 900000); // 15dk fallback
    const expireDate = new Date(Date.now() + expireMs);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expireDate;
    await user.save();

    const apiBase = (
      process.env.API_BASE_URL ??
      process.env.BACKEND_URL ??
      'http://localhost:4000/api'
    ).replace(/\/$/, '');

    const resetUrl = `${apiBase}/auth/reset-password?token=${resetToken}`;

    await this.emailService.sendMail(
      user.email,
      '🔑 Password reset request',
      `
        <h2>Reset your password</h2>
        <p>Click the button below to choose a new password:</p>
        <a href="${resetUrl}"
           style="background:#2196f3;color:white;padding:10px 18px;
           text-decoration:none;border-radius:6px;">Reset password</a>
        <p>This link is valid for 15 minutes.</p>
      `,
    );

    return 'Password reset link has been sent to your email.';
  }

  // ✅ Şifre Güncelleme
  async resetPassword(token: string, newPassword: string): Promise<string> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) throw new BadRequestException('Invalid or expired reset link.');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return 'Your password has been updated successfully 🎉';
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
    if (!user) throw new UnauthorizedException('User not found.');

    if (!user.isVerified)
      throw new UnauthorizedException(
        'Your email address is not verified. Please check your inbox.',
      );

    if (!user.password) {
      // e.g. Google-only accounts
      throw new UnauthorizedException('This account cannot sign in with a password.');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Incorrect password.');

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
