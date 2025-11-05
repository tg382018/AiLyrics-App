import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PromptHistory } from 'src/prompts/prompt-history.schema';
import { User } from 'src/users/users.schema';

@Schema({ timestamps: true })
export class Song extends Document {
  @Prop() title: string;
  @Prop() lyrics: string;
  @Prop() topic: string;
  @Prop() mood: string;
  @Prop() genre: string;
  @Prop() language: string;
  @Prop() style: string;
  @Prop() era: string;
  @Prop() verses: string;
  @Prop() creativity: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: Types.ObjectId, ref: 'PromptHistory' })
  prompt?: PromptHistory;

  @Prop({ default: 0 })
  likeCount: number;

  // 👇 Bunları ekle
  @Prop() createdAt?: Date;
  @Prop() updatedAt?: Date;

  
}

export const SongSchema = SchemaFactory.createForClass(Song);
