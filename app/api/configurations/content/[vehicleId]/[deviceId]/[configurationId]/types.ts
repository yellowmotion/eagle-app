import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsString,
  Length,
} from 'class-validator';

export type RouteParams = {
  vehicleId: string;
  deviceId: string;
  configurationId: string;
};

export class ConfigurationMongoContent {
  @IsString()
  vehicleId!: string;

  @IsString()
  deviceId!: string;

  @IsString()
  configurationId!: string;

  @IsString()
  @Length(40)
  configurationVersionHash!: string;

  @IsNotEmpty()
  @IsObject()
  content!: object;

  @IsEmail()
  updatedBy!: string;

  @IsString()
  lastUpdate!: string;
}
