import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Supplier } from './entities/supplier.entity';
import { SupplierSchema } from './supplier.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports:[MongooseModule.forFeature([{name:Supplier.name,schema:SupplierSchema}]),SupplierModule],
  
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
