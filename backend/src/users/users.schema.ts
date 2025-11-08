import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  // 🔹 Temel bilgiler
  @Prop()
  username?: string; // Google'dan gelenlerde olmayabilir

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string; // Google kullanıcılarında olmayacak

  // 🔹 Rol
  @Prop({ default: 'user' })
  role: string;

  // 🔹 Doğrulama
  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  verificationToken?: string;

  // 🔹 Şifre sıfırlama
  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  // 🔹 Sosyal giriş bilgileri
  @Prop()
  provider?: string; // örn: 'local' | 'google'

  @Prop()
  googleId?: string; // Google kullanıcıları için ek ID

  @Prop()
  profileImage?: string; // Google profil resmi
}

export const UserSchema = SchemaFactory.createForClass(User);
