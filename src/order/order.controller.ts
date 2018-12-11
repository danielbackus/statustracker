import {
  Controller,
  Get,
  Query,
  BadRequestException,
  UseGuards,
  Post,
  UseInterceptors,
  FileInterceptor,
  UploadedFile,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/order')
export class OrderController {
  private locked: boolean = false;

  constructor(private readonly orderService: OrderService) {}

  lock(): void {
    this.locked = true;
  }

  unlock(): void {
    this.locked = false;
  }

  @Get()
  async findByOrderNumber(@Query() params): Promise<Order[]> {
    if (this.locked) throw new ServiceUnavailableException();
    const { orderNumber, storeNumber } = params;
    if (!orderNumber) throw new BadRequestException();
    const orders: Order[] = await this.orderService.findByOrderAndStore(
      orderNumber,
      storeNumber,
    );
    return orders;
  }

  @Post('upload')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: object): Promise<void> {
    if (this.locked) throw new ServiceUnavailableException();
    this.locked = true;
    try {
      await this.orderService.handleUpload(file);
    } catch (e) {
      throw new BadRequestException();
    } finally {
      this.locked = false;
    }
    return;
  }
}
