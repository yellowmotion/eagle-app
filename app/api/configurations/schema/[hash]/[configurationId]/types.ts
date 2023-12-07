import { IsString, IsUrl } from 'class-validator';

export type RouteParams = {
  hash: string;
  configurationId: string;
};

export class SchemaBindingMongoContent {
  @IsString()
  configurationId!: string;

  @IsString()
  url!: string;
}
