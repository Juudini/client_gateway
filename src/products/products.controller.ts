import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createProduct(@Body() createProduct: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, createProduct);
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto): Observable<any> {
    return this.client.send({ cmd: 'find_all_products' }, { ...paginationDto });
  }

  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.client.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProduct: UpdateProductDto,
  ) {
    return this.client
      .send({ cmd: 'update_product' }, { id, ...updateProduct })
      .pipe(
        catchError(err => {
          throw new RpcException(err);
        }),
      );
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.client.send({ cmd: 'delete_product ' }, { id }).pipe(
      catchError(err => {
        throw new RpcException(err);
      }),
    );
  }
}
