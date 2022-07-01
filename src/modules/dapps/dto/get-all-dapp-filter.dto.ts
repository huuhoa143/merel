import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import {
  DEFAULT_QUERY_LIMIT,
  DEFAULT_QUERY_PAGE,
} from '../constants/dapps.constant';

export class GetAllDappFilterDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = DEFAULT_QUERY_PAGE;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit?: number = DEFAULT_QUERY_LIMIT;

  @IsString()
  @IsOptional()
  @Type(() => String)
  search: string;
}
