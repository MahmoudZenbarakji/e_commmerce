import { Module } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { RequestProductController } from './request-product.controller';
import { RequestProduct, RequestproductSchema } from './requestProduct.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports:[MongooseModule.forFeature([{name:RequestProduct.name,schema:RequestproductSchema}])],
  controllers: [RequestProductController],
  providers: [RequestProductService],
})
export class RequestProductModule {}
