import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Trim } from '../../decorators/trim.decorator';

export class SearchParkingDeviceDto extends PaginationQueryDto {
  @ApiProperty({
    description: '차단기 이름 검색',
    example: '정문',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Trim()
  name?: string;

  @ApiProperty({
    description: '차단기 타입 (1: 라즈베리파이, 2: 통합보드)',
    enum: [1, 2],
    required: false,
  })
  @IsNumber()
  @IsIn([1, 2])
  @Type(() => Number)
  @IsOptional()
  device_type?: number;

  @ApiProperty({
    description: '차단기 상태 (1: 자동운행, 2: 항시열림, 3: 바이패스)',
    enum: [1, 2, 3],
    required: false,
  })
  @IsNumber()
  @IsIn([1, 2, 3])
  @Type(() => Number)
  @IsOptional()
  status?: number;

  @ApiProperty({
    description: 'IP 주소 검색',
    example: '192.168.1',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Trim()
  ip?: string;

  @ApiProperty({
    description: '택시 출입 허용 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    required: false,
  })
  @IsNumber()
  @IsIn([0, 1])
  @Type(() => Number)
  @IsOptional()
  taxi_permission?: number;
}
