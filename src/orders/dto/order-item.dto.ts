import { IsNumber, IsPositive } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsPositive()
  productId: number;
}
