import { Injectable, Logger } from '@nestjs/common';
import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';
import * as fs from 'fs/promises';
import * as uuid from 'uuid';
import { UploadAndCompressResDto } from './dto/upload-and-compress-res.dto';
import { SquooshRepository } from './squoosh.repository';

@Injectable()
export class SquooshService {
  private readonly;
  public isWorking = false;

  constructor(
    private readonly squooshRepo: SquooshRepository,
    private readonly logger: Logger,
  ) {}

  async compress(
    file: Express.Multer.File,
    sessionId: string,
  ): Promise<UploadAndCompressResDto> {
    this.isWorking = true;
    const imagePool = new ImagePool(cpus().length);

    let newSize: number;
    const saveAsName = `${uuid.v4()}.jpg`;

    try {
      const encodeOptions = {
        mozjpeg: {},
      };
      const image = imagePool.ingestImage(file.buffer);
      const result = await image.encode(encodeOptions);

      newSize = result.mozjpeg.size;
      fs.writeFile(`files/uploads/${saveAsName}`, result.mozjpeg.binary);
    } catch (e) {
      this.logger.error(
        `Occur error when compressing image, ${file.originalname}`,
      );
      this.logger.debug(JSON.stringify(e));
      throw new Error(
        `Occur error when compressing image, ${file.originalname}`,
      );
    } finally {
      await imagePool.close();
      this.isWorking = false;
    }

    this.squooshRepo.add({
      file: {
        originalName: file.originalname.replace(/\..*$/, ''),
        saveAsName,
        sessionId: sessionId,
      },
      delayDeleteTimeInSecond: 300,
    });

    return {
      filename: file.originalname,
      newSize: newSize,
    };
  }

  async getZip(sessionId: string) {
    const fileInfos = this.squooshRepo.getUploadedFiles(sessionId);

    if (fileInfos.length === 0) throw new Error('No file found');

    const JSZip = require('jszip');
    const zip = new JSZip();

    for (let i = 0; i < fileInfos.length; i++) {
      const { originalName, saveAsName } = fileInfos[i];
      const data = await fs.readFile(`./files/uploads/${saveAsName}`);
      zip.file(`${originalName}.jpg`, data);
    }

    const file = await zip.generateAsync({ type: 'uint8array' });

    return file;
  }
}
