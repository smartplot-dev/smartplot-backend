import {
    Controller,
    Get,
    Post,
    Body,
    Delete,
    Param,
    ParseIntPipe,
    Request,
    Put,
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from 'src/dto/create-notice.dto';
import { Notice } from 'src/entities/notice.entity';

@Controller('notices')
export class NoticesController {
    constructor(
        private readonly noticesService: NoticesService,
    ) {}

    @Post()
    create(@Body() createNoticeDto: CreateNoticeDto, @Request() req): Promise<Notice> {
        const userId = req.user.id; // assuming user ID is stored in the request object
        return this.noticesService.createNotice(createNoticeDto, userId);
    }

    @Get()
    getAll(): Promise<Notice[]> {
        return this.noticesService.findAllNotices();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number): Promise<Notice | null> {
        return this.noticesService.findNoticeById(id);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.noticesService.deleteNotice(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateNoticeDto: CreateNoticeDto,
    ): Promise<Notice | null> {
        return this.noticesService.updateNotice(id, updateNoticeDto);
    }
}
