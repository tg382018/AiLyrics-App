import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';

@Module({
  providers: [LlmService],
  exports: [LlmService], // başka modüller kullanabilsin
})
export class LlmModule {}
