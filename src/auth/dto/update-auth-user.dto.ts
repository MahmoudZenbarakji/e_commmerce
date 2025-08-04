import { PartialType } from '@nestjs/mapped-types';
import { SignInDto,SignUpDto } from './auth-user.dto';

export class UpdateUserDto extends PartialType(SignInDto) {}

