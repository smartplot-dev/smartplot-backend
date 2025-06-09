import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { CreateInvoiceDto } from 'src/dto/create-invoice.dto';
import { ParcelService } from 'src/parcel/parcel.service';
import { UsersService } from 'src/users/users.service';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';


@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        private readonly parcelService: ParcelService,
        private readonly usersService: UsersService,
    ) {}

    async createInvoice(createInvoiceDto: CreateInvoiceDto, id_parcel: number): Promise<number> {
        const invoice = new Invoice();
        invoice.invoice_category = createInvoiceDto.invoice_category;
        if(createInvoiceDto.invoice_category) {
            invoice.invoice_category = createInvoiceDto.invoice_category;
        } else {
            throw new BadRequestException('Invoice category is required');
        }
        if (createInvoiceDto.invoice_description) {
            invoice.invoice_description = createInvoiceDto.invoice_description;
        }
        if( !createInvoiceDto.amount || createInvoiceDto.amount <= 0 ) {
            throw new BadRequestException('Invalid amount or not provided');
        }
        invoice.amount = createInvoiceDto.amount;
        if( createInvoiceDto.invoice_date ) {
            invoice.invoice_date = createInvoiceDto.invoice_date;
        }
        if (!createInvoiceDto.due_date) {
            throw new BadRequestException('Invoice due date is required');
        }
        invoice.due_date = createInvoiceDto.due_date;

        if (!createInvoiceDto.status) {
            createInvoiceDto.status = 'pending';
        }
        invoice.status = createInvoiceDto.status;

        const parcel = await this.parcelService.findParcelById(id_parcel);
        if (!parcel) {
            throw new BadRequestException('Parcel not found');
        }
        invoice.parcel = parcel;

        await this.invoiceRepository.save(invoice);
        return invoice.id;
    }

    async findAllInvoices(): Promise<Invoice[]> {
        return await this.invoiceRepository.find({relations: ['parcel']});
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

    async updateInvoice(id: number, updateData: Partial<CreateInvoiceDto>): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOneBy({ id });
        if (!invoice) {
            throw new BadRequestException('Invoice not found');
        }
        Object.assign(invoice, updateData);
        return await this.invoiceRepository.save(invoice);
    }

    async findInvoiceByIdWithParcels(id: number): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ['parcel'],
        });
        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }
        return invoice;
    }

    async getInvoicesWithParcelsAndUsers(): Promise<Invoice[]> {
        const invoices = await this.invoiceRepository.find({
            relations: ['parcel', 'parcel.users'],
        });
        if (!invoices || invoices.length === 0) {
            throw new NotFoundException('No invoices found');
        }
        return invoices;
    }

    // FIXME!
    async findInvoicesByUser(userId: number): Promise<Invoice[]> {
        const user = await this.usersService.findUserById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.parcels = await this.parcelService.findUserParcels(userId);
        if (!user.parcels || user.parcels.length === 0) {
            throw new NotFoundException('No parcels found for this user, cannot retrieve invoices');
        }
        const invoices: Invoice[] = [];
        for (const parcel of user.parcels) {
            const parcelInvoices = await this.invoiceRepository.find({
                where: { parcel: { id_parcel: parcel.id_parcel } },
            });
            for (const inv of parcelInvoices) {
                inv.parcel = parcel; // Associate the parcel with the invoice
                invoices.push(inv);
            }
        }
        if (invoices.length === 0) {
            throw new NotFoundException('No invoices found for this user');
        }
        return invoices;
    }
    async uploadInvoiceFile(id: number, file: Express.Multer.File) {
        const invoice = await this.invoiceRepository.findOneBy({ id });
        if (!invoice) {
            throw new BadRequestException('Invoice not found');
        }
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Crea la carpeta si no existe
        const uploadDir = join(__dirname, '..', '..', 'uploads', 'invoices');
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        // Guarda el archivo
        const filePath = join(uploadDir, `${id}_${file.originalname}`);
        writeFileSync(filePath, file.buffer);

        invoice.file_path = filePath;
        await this.invoiceRepository.save(invoice);

        return { message: 'Archivo subido correctamente', filePath };
    }
}
