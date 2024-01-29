import { IsBoolean, IsEmail, IsString } from "class-validator";

export class DeviceApiPostContent {

  @IsString()
  vehicleId!: string

  @IsString()
  deviceId!: string
}

export class DeviceMondoContent extends DeviceApiPostContent {

  @IsEmail()
  owner!: string

  @IsString()
  lastUpdate!: string

  @IsBoolean()
  fixed!: boolean
}

