import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { getConnection, Repository } from 'typeorm';
import * as Excel from 'exceljs';
import { Readable } from 'stream';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findByOrderAndStore(
    orderNumber: number,
    storeNumber: string,
  ): Promise<Order[]> {
    if (!orderNumber || !storeNumber) throw new BadRequestException();
    return await this.orderRepository.find({ orderNumber, storeNumber });
  }

  async handleUpload(file) {
    console.log({ file });
    await this.orderRepository.delete({});

    const readable = new Readable();
    readable.push(file.buffer);
    readable.push(null);

    const workbook = new Excel.Workbook();
    await workbook.xlsx.read(readable);
    const orders: object[] = this.processWorkbook(workbook);
    const inserts = [];
    while (orders.length > 0) {
      inserts.push(orders.splice(0, 124));
    }
    for (const insert of inserts) {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Order)
        .values(insert)
        .useTransaction(true)
        .execute();
    }
    return;
  }

  processWorkbook(workbook: Excel.Workbook) {
    const sheet = workbook.worksheets.find(
      s => s.name.toLowerCase() === process.env.PURCHASE_ORDER_SHEETNAME,
    );
    const cols = [];
    sheet.getRow(1).eachCell(cell => cols.push(cell.value));
    return this.getArrayofObjects(this.getKeys(cols), sheet).filter(
      o => o.orderNumber && o.storeNumber,
    );
  }

  getKeys(columnNames) {
    const sheet = {};
    if (columnNames.length) {
      for (const col of columnNames) {
        sheet[col] = [];
      }
      return sheet;
    }
  }

  getArrayofObjects(keys, sheet) {
    const array = [];
    for (let i = 1; i < sheet.rowCount; i++) {
      const row = sheet.getRow(i + 1);
      let index = 0;
      const obj = {
        orderNumber: null,
        storeNumber: null,
        eta: null,
      };
      for (const key of Object.keys(keys)) {
        index++;
        let prop = null;
        if (prop) obj[key.toLowerCase()] = row.getCell(index).value;
      }
      array.push(obj);
    }
    return array;
  }
}
