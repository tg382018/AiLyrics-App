import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Like extends Document {
  @Prop({ required: true }) userId: string;

  @Prop({ required: true }) songId: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
