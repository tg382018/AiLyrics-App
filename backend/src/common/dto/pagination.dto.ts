import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Sayfa numarası', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Sayfa başına sonuç sayısı', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
