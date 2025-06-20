import { SetMetadata } from "@nestjs/common";

export const FIELDS_KEY = "fields";
export const ExcludeFields = (...fields: string[]) =>
  SetMetadata(FIELDS_KEY, fields);
