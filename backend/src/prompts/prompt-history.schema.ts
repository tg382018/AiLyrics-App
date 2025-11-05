import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Song } from '../songs/song.schema';

@Schema({ timestamps: true })
export class PromptHistory extends Document {
  @Prop({ required: true }) userId: string;

  @Prop({ required: true }) prompt: string;

  // 👇 Şarkıya birebir ilişki
  @Prop({ type: Types.ObjectId, ref: 'Song', required: true })
  song: Song;
}

export const PromptHistorySchema = SchemaFactory.createForClass(PromptHistory);
