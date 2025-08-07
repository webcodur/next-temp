import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateParkingDeviceDto } from './create-parking-device.dto';

export class UpdateParkingDeviceDto extends PartialType(
  OmitType(CreateParkingDeviceDto, [] as const),
) {}

export class UpdateParkingDeviceWithPolicyDto extends UpdateParkingDeviceDto {}
