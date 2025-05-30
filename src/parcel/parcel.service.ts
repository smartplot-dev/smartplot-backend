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
    
        async updateParcelNumber(id_parcel: number, numero_parcela: string): Promise<Parcel | null> {
        const parcel = await this.parcelRepository.findOne({
        where: { id_parcel },
        relations: ['users'], // <-- Esto carga los usuarios asociados
        });
            if (!parcel) throw new Error('Parcel not found');

  // 2. Actualiza el número de parcela
        parcel.numero_parcela = numero_parcela;
        await this.parcelRepository.save(parcel);

  // 3. Vuelve a buscar la parcela con relaciones actualizadas (opcional, pero recomendado)
        return this.parcelRepository.findOne({
            where: { id_parcel },
            relations: ['users'],
        });
        }
    
        async removeParcel(id_parcel: number): Promise<void> {
            const parcel = await this.parcelRepository.findOneBy({ id_parcel });
            if (parcel) {
                await this.parcelRepository.remove(parcel);
            }
        }
}
