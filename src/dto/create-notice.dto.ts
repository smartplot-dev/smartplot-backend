export class CreateNoticeDto {
    title: string;
    content: string;
    visible?: boolean; // optional, defaults to false
}