import { Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe,
 } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from 'src/dto/create-invoice.dto';
import { Invoice } from 'src/entities/invoice.entity';

@Controller('invoice')
export class InvoiceController {
    constructor(
        private readonly invoiceService: InvoiceService
    ) {}

    @Post(':id_parcel')
    create(
        @Body() createInvoiceDto: CreateInvoiceDto,
        @Param('id_parcel', ParseIntPipe) id_parcel: number
    ): Promise<Invoice> {
        return this.invoiceService.createInvoice(createInvoiceDto, id_parcel);
    }

    @Get()
    getAll(): Promise<Invoice[]> {
        return this.invoiceService.findAllInvoices();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number): Promise<Invoice | null> {
        return this.invoiceService.findInvoiceById(id);
    }

    @Get('parcel/:id_parcel')
    getByParcelId(@Param('id_parcel', ParseIntPipe) id_parcel: number): Promise<Invoice[]> {
        return this.invoiceService.findInvoicesByParcelId(id_parcel);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.invoiceService.deleteInvoice(id);
    }
}
