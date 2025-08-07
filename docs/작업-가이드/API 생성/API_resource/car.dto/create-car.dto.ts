import {
  IsString,
  IsOptional,
  IsInt,
  IsIn,
  Length,
  Matches,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '../../decorators/trim.decorator';

export class CreateCarDto {
  @ApiProperty({
    description: '차량 번호',
    example: '12가3456',
    maxLength: 20,
  })
  @IsString()
  @Length(1, 20)
  @Trim()
  car_number: string;

  @ApiProperty({
    description: '차량 브랜드',
    example: '현대',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Trim()
  brand?: string;

  @ApiProperty({
    description: '차량 모델',
    example: '아반떼',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Trim()
  model?: string;

  @ApiProperty({
    description: '차종',
    example: '준중형',
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  @Trim()
  type?: string;

  @ApiProperty({
    description: '차량 외판 텍스트 검출',
    example: '검은색 세단',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  @Trim()
  outer_text?: string;

  @ApiProperty({
    description: '연식',
    example: 2022,
    minimum: 1900,
    maximum: 2030,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2030)
  year?: number;

  @ApiProperty({
    description: '외부 스티커',
    example: '장애인 주차',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Trim()
  external_sticker?: string;

  @ApiProperty({
    description: '연료 타입',
    example: '가솔린',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Trim()
  fuel?: string;

  @ApiProperty({
    description: '전면 이미지 URL',
    example: 'https://example.com/images/car_front.jpg',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Trim()
  front_image_url?: string;

  @ApiProperty({
    description: '후면 이미지 URL',
    example: 'https://example.com/images/car_rear.jpg',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Trim()
  rear_image_url?: string;

  @ApiProperty({
    description: '측면 이미지 URL',
    example: 'https://example.com/images/car_side.jpg',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Trim()
  side_image_url?: string;

  @ApiProperty({
    description: '상단 이미지 URL',
    example: 'https://example.com/images/car_top.jpg',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Trim()
  top_image_url?: string;
}
