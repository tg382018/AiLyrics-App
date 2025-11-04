import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  @Prop() createdBy: string; // user id (ileride auth eklendiğinde)
}

export const SongSchema = SchemaFactory.createForClass(Song);
