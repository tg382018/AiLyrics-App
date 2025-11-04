import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromptsController } from './prompts.controller';
import { PromptsService } from './prompts.service';
import { PromptHistory, PromptHistorySchema } from './prompt-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromptHistory.name, schema: PromptHistorySchema },
    ]),
  ],
  controllers: [PromptsController],
  providers: [PromptsService],
  exports: [PromptsService],
})
export class PromptsModule {}
