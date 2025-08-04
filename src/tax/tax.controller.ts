import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { Roles } from 'src/decorators/Roles.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post()
  @Roles(["admin"])
  @UseGuards(AuthGuard)
  create(@Body() createTaxDto: CreateTaxDto) {
    return this.taxService.createAndUpdate(createTaxDto);
  }

  @Get()
  find() {
    return this.taxService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaxDto: UpdateTaxDto) {
    return this.taxService.update(+id, updateTaxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxService.reSet();
  }
}
