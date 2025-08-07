import { IsOptional, IsString, IsIn, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSearchDto } from '../../common/dto/base.dto';
import { Trim } from '../../decorators/trim.decorator';

export class SearchResidentDto extends BaseSearchDto {
  @ApiProperty({
    description: '거주자 이름',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  name?: string;

  @ApiProperty({
    description: '전화번호',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  phone?: string;

  @ApiProperty({
    description: '이메일',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  email?: string;

  @ApiProperty({
    description: '성별',
    enum: ['M', 'F'],
    required: false,
  })
  @IsOptional()
  @IsIn(['M', 'F'])
  gender?: string;

  @ApiProperty({
    description: '주차장 ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parkinglot_id?: number;

  @ApiProperty({
    description: '주소 1depth',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  address_1depth?: string;

  @ApiProperty({
    description: '주소 2depth',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  address_2depth?: string;

  @ApiProperty({
    description: '주소 3depth',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  address_3depth?: string;
}
