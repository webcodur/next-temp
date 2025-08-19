import { PartialType } from '@nestjs/swagger';
import { CreateInstanceDto } from './create-instance.dto';

/**
 * UpdateInstanceDto
 * 인스턴스 수정을 위한 DTO
 */
export class UpdateInstanceDto extends PartialType(CreateInstanceDto) {}
