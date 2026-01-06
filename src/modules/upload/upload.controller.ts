import { Controller, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Worker } from 'worker_threads';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Controller('upload')
export class UploadController {
    constructor(private configService: ConfigService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
        }

        return new Promise((resolve, reject) => {
            const worker = new Worker(path.resolve(__dirname, '../../workers/upload.worker.js'), {
                workerData: {
                    filePath: file.path,
                    fileType: file.mimetype.includes('csv') ? 'csv' : 'xlsx',
                    mongoUri: this.configService.get<string>('MONGO_URI'),
                },
            });

            worker.on('message', (message) => {
                if (message.status === 'success') {
                    resolve({ message: 'File processed successfully', count: message.count });
                } else {
                    reject(new HttpException(message.error, HttpStatus.INTERNAL_SERVER_ERROR));
                }
            });

            worker.on('error', (err) => {
                reject(new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR));
            });

            worker.on('exit', (code) => {
                if (code !== 0) {
                    // Worker error handled in message or error event mostly
                }
            });
        });
    }
}
