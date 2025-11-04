import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PromptsService } from './prompts.service';

@ApiTags('prompts')
@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('me')
  async getMyPrompts(@Request() req) {
    return this.promptsService.getUserPrompts(req.user.userId);
  }
}
