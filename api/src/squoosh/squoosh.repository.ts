import { UploadedFile } from './types/uploaded-file.type';
import * as fs from 'fs';

export class SquooshRepository {
  private uploadedFiles: UploadedFile[] = [];

  getUploadedFiles(sessionId: string): UploadedFile[] {
    return this.uploadedFiles.filter((f) => f.sessionId === sessionId);
  }

  add(content: {
    file: UploadedFile;
    delayDeleteTimeInSecond: number;
  }): UploadedFile {
    const { file, delayDeleteTimeInSecond } = content;
    if (delayDeleteTimeInSecond <= 0)
      throw Error('delayDeleteTimeInSecond must be greater than 0');

    const newFile: UploadedFile = {
      originalName: file.originalName,
      saveAsName: file.saveAsName,
      sessionId: file.sessionId,
    };

    this.uploadedFiles.push(newFile);

    setTimeout(() => {
      this.uploadedFiles = this.uploadedFiles.filter(
        (f) => f.saveAsName !== file.saveAsName,
      );
      if (fs.existsSync(`./files/uploads/${file.saveAsName}`)) {
        fs.rmSync(`./files/uploads/${file.saveAsName}`);
      }
    }, delayDeleteTimeInSecond * 1000);

    return newFile;
  }
}
