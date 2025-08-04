import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategryDto } from './create-subcategry.dto';

export class UpdateSubcategryDto extends PartialType(CreateSubcategryDto) {}
