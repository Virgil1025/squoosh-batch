import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  ParseFloatPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SquooshService } from './squoosh.service';
import { Response } from 'express';
import { UploadAndCompressResDto } from './dto/upload-and-compress-res.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as _ from 'lodash';

@Controller('squoosh')
export class SquooshController {
  constructor(
    private readonly squooshService: SquooshService,
    private readonly logger: Logger,
  ) {}

  @Post('uploadAndCompress/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndCompress(
    @UploadedFile('file') file: Express.Multer.File,
    @Param('id', ParseFloatPipe) sessionId: number,
  ): Promise<UploadAndCompressResDto> {
    if (!file) throw new BadRequestException('No file found');

    try {
      while (true) {
        if (!this.squooshService.isWorking) break;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      const dto = await this.squooshService.compress(
        file,
        sessionId.toString(),
      );
      return dto;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('getZip/:id')
  async getZip(
    @Res() res: Response,
    @Param('id', ParseFloatPipe) sessionId: number,
  ) {
    try {
      const zip = await this.squooshService.getZip(sessionId.toString());
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=compressed_jpg_${sessionId}.zip`,
      );
      res.end(zip);
    } catch (e) {
      if (e.message === 'No file found')
        throw new BadRequestException(
          'The session is expired, please refresh and upload again',
        );
      else {
        this.logger.error(e.message);
        throw new BadRequestException(
          'Unknown error, please refresh and upload again',
        );
      }
    }
  }
}
