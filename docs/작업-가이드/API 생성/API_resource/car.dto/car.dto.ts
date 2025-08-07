import { ApiProperty } from '@nestjs/swagger';
import { CarInstanceDto } from './car-instance.dto';
import {
  BaseIdEntityDto,
  BaseListResponseDto,
} from '../../common/dto/base.dto';
import { DetailResponseDto } from '../../common/dto/page.dto';

export class CarDto extends BaseIdEntityDto {
  @ApiProperty({
    description: '차량 번호',
    example: '12가3456',
  })
  car_number: string;

  @ApiProperty({
    description: '차량 브랜드',
    example: '현대',
  })
  brand?: string | null;

  @ApiProperty({
    description: '차량 모델',
    example: '아반떼',
  })
  model?: string | null;

  @ApiProperty({
    description: '차종',
    example: '준중형',
  })
  type?: string | null;

  @ApiProperty({
    description: '차량 외판 텍스트 검출',
    example: '검은색 세단',
  })
  outer_text?: string | null;

  @ApiProperty({
    description: '연식',
    example: 2022,
  })
  year?: number | null;

  @ApiProperty({
    description: '외부 스티커',
    example: '장애인 주차',
  })
  external_sticker?: string | null;

  @ApiProperty({
    description: '연료 타입',
    example: '가솔린',
  })
  fuel?: string | null;

  @ApiProperty({
    description: '전면 이미지 URL',
    example: 'https://example.com/images/car_front.jpg',
  })
  front_image_url?: string | null;

  @ApiProperty({
    description: '후면 이미지 URL',
    example: 'https://example.com/images/car_rear.jpg',
  })
  rear_image_url?: string | null;

  @ApiProperty({
    description: '측면 이미지 URL',
    example: 'https://example.com/images/car_side.jpg',
  })
  side_image_url?: string | null;

  @ApiProperty({
    description: '상단 이미지 URL',
    example: 'https://example.com/images/car_top.jpg',
  })
  top_image_url?: string | null;
}

export class CarWithInstanceDto extends CarDto {
  @ApiProperty({
    description: '차량 소유자 수',
    type: [CarInstanceDto],
  })
  car_instance: CarInstanceDto[];
}

/**
 * 차량 목록 조회 응답 DTO
 */
export class CarListResponseDto extends BaseListResponseDto<CarDto> {
  constructor(
    data: CarDto[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Success',
  ) {
    super(data, total, page, limit, message);
  }
}

/**
 * 차량 상세 조회 응답 DTO
 */
export class CarDetailResponseDto extends DetailResponseDto<CarWithInstanceDto> {
  constructor(data: CarWithInstanceDto, message: string = 'Success') {
    super(data, message);
  }
}
