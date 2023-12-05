import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNumber, Max, Min, ValidateNested } from "class-validator";

export class AirtableBodyRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AirtableRole)
  roles!: AirtableRole[]
}

export class AirtableRole {
  @IsEmail()
  email!: string

  @Min(-1)
  @Max(255)
  @IsNumber()
  role!: number
}