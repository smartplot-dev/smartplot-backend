import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcel } from 'src/entities/parcel.entity';
import { CreateParcelDto } from 'src/dto/create-parcela.dto';
import { Meter } from 'src/entities/meter.entity';
import { User } from 'src/entities/user.entity';
import { MeterService } from '../meter/meter/meter.service'; // Asegúrate de que MeterService es el servicio correcto para manejar los medidores
@Injectable()
export class ParcelService {
    constructor(
            @InjectRepository(Parcel)
            private readonly parcelRepository: Repository<Parcel>,
            @Inject(forwardRef(() => MeterService)) // Asegúrate de que MeterService es el servicio correcto para manejar los medidores
            private readonly meterService: MeterService, // Asegúrate de que MeterService es el servicio correcto para manejar los medidores
        ) {}
    
        async createParcel(createParcelDto: CreateParcelDto): Promise<Parcel> {
            // validate that createParcelDto is not empty
            if (!createParcelDto || !createParcelDto.numero_parcela) {
                throw new BadRequestException('createParcelDto is required and must contain a numero_parcela');
            }
            const parcel = new Parcel();
            parcel.numero_parcela = createParcelDto.numero_parcela // Asegúrate de que meters sea una entidad Meter válida
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
            if (!parcel) {
                throw new BadRequestException('Parcel not found');
            }
            await this.meterService.deleteMeterAndReadingByParcelId(id_parcel);

            await this.parcelRepository.remove(parcel);
        }

        async findUserParcels(userId: number): Promise<Parcel[]> {
            return this.parcelRepository.find({
                where: { users: { id: userId } },
                relations: ['users', 'meters'],
            });
        }

        async findParcelOwners(parcelId: number): Promise<User[]> {
            const parcel = await this.parcelRepository.findOne({
                where: { id_parcel: parcelId },
                relations: ['users'],
            });

            if (!parcel) {
                throw new BadRequestException('Parcel not found');
            }

            return parcel.users;
        }
}
