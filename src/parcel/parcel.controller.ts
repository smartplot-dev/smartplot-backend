import {Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe, } from '@nestjs/common';
import { ParcelService } from './parcel.service';
import { CreateParcelDto } from 'src/dto/create-parcela.dto';
import { Parcel } from 'src/entities/parcel.entity';

@Controller('parcel')
export class ParcelController {constructor(
        private readonly parcelService: ParcelService
    ) {}

    @Post()
    create(@Body() createParcelDto: CreateParcelDto): Promise<Parcel> {
        return this.parcelService.createParcel(createParcelDto);
    }
    @Get()
    getAll(): Promise<Parcel[]> {
        return this.parcelService.findAllParcels();
    }
    @Get(':id_parcel')
    getById(@Param('id_parcel', ParseIntPipe) id_parcel: number): Promise<Parcel | null> {
        return this.parcelService.findParcelById(id_parcel);
    }
    @Delete(':id_parcel')
    delete(@Param('id_parcel', ParseIntPipe) id_parcel: number): Promise<void> {
        return this.parcelService.removeParcel(id_parcel);
    }}
