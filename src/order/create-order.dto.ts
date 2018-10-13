import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  Allow,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumberString()
  readonly orderNumber: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly storeNumber: string;

  @Allow()
  readonly customerName?: string;

  @Allow()
  readonly status?: string;

  @Allow()
  readonly orderDate?: Date;

  @Allow()
  readonly shipDate?: Date;

  @Allow()
  readonly shippingCarrier?: string;

  @Allow()
  readonly estimatedDeliveryDate?: Date;
}
