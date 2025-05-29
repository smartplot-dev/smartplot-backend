import { ApiProperty } from "@nestjs/swagger";

export class CreateNoticeDto {
    @ApiProperty({
        type: String,
        example: 'Mantenimiento programado',
        description: 'Título del aviso'
    })
    title: string;

    @ApiProperty({
        type: String,
        example: 'El sistema estará en mantenimiento desde las 2 AM hasta las 4 AM.',
        description: 'Contenido del aviso'
    })
    content: string;

    @ApiProperty({
        type: Boolean,
        example: 'true',
        description: 'Visibilidad del aviso (true para visible, false para oculto, si no se especifica, se asume false)',
        required: false
    })
    visible?: boolean; // optional, defaults to false
}