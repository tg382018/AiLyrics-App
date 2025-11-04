    import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;

    // 🔹 VERIFICATION
  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  verificationToken?: string;

    // 🔹 RESET PW
    @Prop() resetPasswordToken?: string;
    @Prop() resetPasswordExpires?: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);
