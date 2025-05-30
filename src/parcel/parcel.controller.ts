import {Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe,Patch } from '@nestjs/common';
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

    @Get('number/:number')
    getByNumber(@Param('number', ParseIntPipe) number: string): Promise<Parcel | null> {
        return this.parcelService.findParcelByNumber(number);
        
    }

    @Patch(':id_parcel')
    async updateParcelNumber(
    @Param('id_parcel', ParseIntPipe) id_parcel: number,
    @Body('numero_parcela') numero_parcela: string,
    ): Promise<Parcel | null> {
        return this.parcelService.updateParcelNumber(id_parcel, numero_parcela);
    }

    @Delete(':id_parcel')
    delete(@Param('id_parcel', ParseIntPipe) id_parcel: number): Promise<void> {
        return this.parcelService.removeParcel(id_parcel);
    }
}
