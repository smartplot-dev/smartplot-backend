import { Injectable, Request } from '@nestjs/common';
import { Notice } from 'src/entities/notice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from 'src/dto/create-notice.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NoticesService {
    constructor(
        @InjectRepository(Notice)
        private readonly noticeRepository: Repository<Notice>,
        private readonly usersService: UsersService,
    ) {}

    async createNotice(createNoticeDto: CreateNoticeDto, user_id: number): Promise<Notice> {
        if (!createNoticeDto.title || !createNoticeDto.content) {
            throw new Error('Title and content are required');
        }
        // Check if the user exists
        const user = await this.usersService.findUserById(user_id);
        if (!user) {
            throw new Error('User not found');
        }
        // Create the notice with the user who uploaded it
        const notice = this.noticeRepository.create({
            ...createNoticeDto,
            uploadedBy: user,
            created_at: new Date(),
        });
        return await this.noticeRepository.save(notice);
    }

    async findAllNotices(): Promise<Notice[]> {
        return await this.noticeRepository.find();
    }

    async findNoticeById(id: number): Promise<Notice | null> {
        return this.noticeRepository.findOneBy({ id });
    }

    async deleteNotice(id: number): Promise<void> {
        const notice = await this.noticeRepository.findOneBy({ id });
        if (!notice) {
            throw new Error('Notice not found');
        }
        await this.noticeRepository.remove(notice);
    }

    async updateNotice(id: number, updateNoticeDto: CreateNoticeDto): Promise<Notice | null> {
        const notice = await this.noticeRepository.findOneBy({ id });
        if (!notice) {
            throw new Error('Notice not found');
        }

        notice.title = updateNoticeDto.title;
        notice.content = updateNoticeDto.content;
        notice.visible = updateNoticeDto.visible ?? notice.visible;
        notice.updated_at = new Date();
        return await this.noticeRepository.save(notice);
    }

}
