import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Trim } from '../../decorators/trim.decorator';

export class SearchCarInstanceDto extends PaginationQueryDto {
  @ApiProperty({
    description: '차량 번호',
    example: '12가2200',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  car_number?: string;

  @ApiProperty({
    description: '인스턴스 ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  instance_id?: number;
}
