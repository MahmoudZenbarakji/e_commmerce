import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Query } from '@nestjs/common';
import { SubcategryService } from './subcategry.service';
import { CreateSubcategryDto } from './dto/create-subcategry.dto';
import { UpdateSubcategryDto } from './dto/update-subcategry.dto';
import { Roles } from 'src/decorators/Roles.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('subcategry')
export class SubcategryController {
  constructor(private readonly subcategryService: SubcategryService) {}

  @Post()
  @Roles(["admin"])
  @UseGuards(AuthGuard)
  create(@Body(new ValidationPipe({forbidNonWhitelisted:true})) createSubcategryDto: CreateSubcategryDto) {
    return this.subcategryService.create(createSubcategryDto);
  }

  @Get()
  findAll(@Query()query) {
    return this.subcategryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategryService.findOne(id);
  }

  @Patch(':id')
  @Roles(["admin"])
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateSubcategryDto: UpdateSubcategryDto) {
    return this.subcategryService.update(id, updateSubcategryDto);
  }

  @Delete(':id')
  @Roles(["admin"])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.subcategryService.remove(id);
  }
}
