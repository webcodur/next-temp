import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsIn,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '../../decorators/trim.decorator';

export class CreateResidentDto {
  @ApiProperty({
    description: '거주자 이름',
    example: '김철수',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  @Trim()
  name: string;

  @ApiProperty({
    description: '전화번호',
    example: '010-1234-5678',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Trim()
  phone?: string;

  @ApiProperty({
    description: '이메일',
    example: 'kim@example.com',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  @Trim()
  email?: string;

  @ApiProperty({
    description: '생년월일',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @ApiProperty({
    description: '성별',
    enum: ['M', 'F'],
    example: 'M',
    required: false,
  })
  @IsOptional()
  @IsIn(['M', 'F'], { message: '성별은 M 또는 F여야 합니다.' })
  gender?: string;

  @ApiProperty({
    description: '비상연락처',
    example: '010-9876-5432',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Trim()
  @Matches(/^(01[0-9])-(\d{3,4})-(\d{4})$/, {
    message: '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)',
  })
  emergency_contact?: string;

  @ApiProperty({
    description: '메모',
    example: '주거주자',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  memo?: string;
}
