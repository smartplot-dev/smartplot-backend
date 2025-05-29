import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcel } from 'src/entities/parcel.entity';
import { CreateParcelDto } from 'src/dto/create-parcela.dto';

@Injectable()
export class ParcelService {
    constructor(
            @InjectRepository(Parcel)
            private readonly parcelRepository: Repository<Parcel>,
        ) {}
    

        async createParcel(createParcelDto: CreateParcelDto): Promise<Parcel> {
            const parcel = new Parcel();
            parcel.numero_parcela = createParcelDto.numero_parcela
            return await this.parcelRepository.save(parcel);
        }
    
        async findAllParcels(): Promise<Parcel[]> {
            return await this.parcelRepository.find();
        }
    
        findParcelById(id_parcel: number): Promise<Parcel | null> {
            return this.parcelRepository.findOneBy( { id_parcel } );
        }
    
        findParcelByNumber(numero_parcela: string): Promise<Parcel | null> {
            return this.parcelRepository.findOneBy({ numero_parcela });
        }
    
        async updateParcel(id_parcel: number, updateParcelDto: CreateParcelDto): Promise<Parcel | null> {
            const parcel = await this.parcelRepository.findOneBy({ id_parcel });
            if (!parcel) {
                return null; // Parcel not found
            }
    
            parcel.numero_parcela = updateParcelDto.numero_parcela;
    
            return await this.parcelRepository.save(parcel);
        }
    
        async removeParcel(id_parcel: number): Promise<void> {
            const parcel = await this.parcelRepository.findOneBy({ id_parcel });
            if (parcel) {
                await this.parcelRepository.remove(parcel);
            }
        }
}
