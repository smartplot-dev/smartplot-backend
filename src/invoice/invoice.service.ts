import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { CreateInvoiceDto } from 'src/dto/create-invoice.dto';
import { ParcelService } from 'src/parcel/parcel.service';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        private readonly parcelService: ParcelService,
    ) {}

    async createInvoice(createInvoiceDto: CreateInvoiceDto, id_parcel: number): Promise<Invoice> {
        const invoice = new Invoice();
        invoice.invoice_category = createInvoiceDto.invoice_category;
        if (createInvoiceDto.invoice_description) {
            invoice.invoice_description = createInvoiceDto.invoice_description;
        }
        invoice.amount = createInvoiceDto.amount;
        if( createInvoiceDto.invoice_date ) {
            invoice.invoice_date = createInvoiceDto.invoice_date;
        }
        invoice.due_date = createInvoiceDto.due_date;
        invoice.status = createInvoiceDto.status;

        const parcel = await this.parcelService.findParcelById(id_parcel);
        if (!parcel) {
            throw new BadRequestException('Parcel not found');
        }
        invoice.parcel = parcel;

        return await this.invoiceRepository.save(invoice);
    }

    async findAllInvoices(): Promise<Invoice[]> {
        return await this.invoiceRepository.find();
    }

    async findInvoiceById(id: number): Promise<Invoice | null> {
        return this.invoiceRepository.findOneBy({ id });
    }

    async findInvoicesByParcelId(id_parcel: number): Promise<Invoice[]> {
        return this.invoiceRepository.find({
            where: { parcel: { id_parcel: id_parcel } },
        });
    }

    async deleteInvoice(id: number): Promise<void> {
        const invoice = await this.invoiceRepository.findOneBy({ id });
        if (!invoice) {
            throw new BadRequestException('Invoice not found');
        }
        await this.invoiceRepository.remove(invoice);
    }
}
