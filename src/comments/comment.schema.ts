import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Song } from '../songs/song.schema';
import { User } from '../users/users.schema';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Song', required: true })
  song: Song;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
