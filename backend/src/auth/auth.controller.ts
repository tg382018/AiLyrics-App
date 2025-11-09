import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}


  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);

    // 🎯 Kullanıcıyı frontend'e yönlendiriyoruz
    const [primaryFrontend] = (
      process.env.FRONTEND_URL ?? 'http://localhost:3005'
    )
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
    const frontendUrl = primaryFrontend ?? 'http://localhost:3005';
    const redirectUrl = `${frontendUrl.replace(/\/$/, '')}/app/login/success?token=${result.token}`;
    return res.redirect(redirectUrl);
  }
  
  // ✅ 1️⃣ Kullanıcı kayıt (doğrulama maili ile)
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.usersService.register(dto);
    return {
      message:
        'Registration successful! Check your email to verify your account 📩',
      email: user.email,
    };
  }

  // ✅ 2️⃣ Kullanıcı giriş (email doğrulaması yapılmış olmalı)
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  // ✅ 3️⃣ E-posta doğrulama linki (GET)
 @Get('verify')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    const verified = await this.usersService.verifyEmail(token);

    if (!verified) {
      return res.send(`
        <div style="font-family:sans-serif;text-align:center;margin-top:100px">
          <h2 style="color:#e53935;">❌ Invalid or expired verification link</h2>
          <p style="color:#555;">Please check your inbox or register again.</p>
        </div>
      `);
    }

    return res.send(`
      <div style="font-family:sans-serif;text-align:center;margin-top:100px">
        <h1 style="color:#2e7d32;">✅ Email verified successfully!</h1>
        <p style="color:#555;">Your account is now active. You can sign in.</p>
        <a href="https://ai-lyrics.com/app/login" 
           style="display:inline-block;margin-top:20px;padding:10px 20px;
                  background:#4CAF50;color:white;text-decoration:none;
                  border-radius:6px;font-weight:600;">
          Continue to Login
        </a>
      </div>
    `);
  }


  // ✅ Şifre unuttum

  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'user@example.com' },
    },
  },
})
@Post('forgot-password')
async forgotPassword(@Body('email') email: string) {
  return this.usersService.requestPasswordReset(email);
}

  // ✅ Şifre sıfırlama sayfası (HTML form)
  @Get('reset-password')
  async resetPasswordPage(@Query('token') token: string, @Res() res: Response) {
    return res.send(`
      <div style="font-family:sans-serif;text-align:center;margin-top:100px">
        <h2>Yeni Şifre Belirle</h2>
        <form method="POST" action="/api/auth/reset-password">
          <input type="hidden" name="token" value="${token}" />
          <input type="password" name="newPassword" placeholder="Yeni Şifre" required
                 style="padding:10px;margin-top:10px;width:250px;border-radius:6px;border:1px solid #ccc"/>
          <br/>
          <button type="submit" style="margin-top:20px;padding:10px 20px;
              background:#2196f3;color:white;border:none;border-radius:6px;">Şifreyi Güncelle</button>
        </form>
      </div>
    `);
  }

  // ✅ Şifreyi gerçekten değiştirme
 @ApiBody({
  schema: {
    type: 'object',
    properties: {
      token: { type: 'string', example: '123abc456def' },
      newPassword: { type: 'string', example: 'YeniSifre123!' },
    },
  },
})
@Post('reset-password')
async resetPassword(
  @Body('token') token: string,
  @Body('newPassword') newPassword: string,
) {
  return this.usersService.resetPassword(token, newPassword);
}

  // ✅ 4️⃣ Me (JWT korumalı)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('me')
  async getProfile(@Request() req) {
    console.log('✅ Authenticated user:', req.user);
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) return { message: 'User not found' };

    const { password, ...userData } = user.toObject();
    return userData;
  }
  
}
