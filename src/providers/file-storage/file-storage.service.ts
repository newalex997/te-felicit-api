import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { StorageConfigService } from '../../common/config/storage/configuration.service';

@Injectable()
export class FileStorageService {
  private s3: S3Client;
  private bucket: string;
  private region: string;

  constructor(storageConfig: StorageConfigService) {
    this.bucket = storageConfig.bucket;
    this.region = storageConfig.region;

    this.s3 = new S3Client({
      endpoint: `https://${this.region}.digitaloceanspaces.com`,
      credentials: {
        accessKeyId: storageConfig.accessKey,
        secretAccessKey: storageConfig.secretKey,
      },
      forcePathStyle: false,
      region: this.region,
    });
  }

  async uploadFile(
    buffer: Buffer,
    filename: string,
    contentType: string,
  ): Promise<string> {
    try {
      const optimisedImageBuffer = await sharp(buffer)
        .resize(600)
        .jpeg()
        .toBuffer();

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: filename,
          Body: optimisedImageBuffer,
          ContentType: contentType,
          ACL: 'public-read',
        }),
      );

      return `https://${this.bucket}.${this.region}.digitaloceanspaces.com/${filename}`;
    } catch {
      throw new Error(`File ${filename} upload failed`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: filePath,
        }),
      );
    } catch {
      throw new Error(`File ${filePath} delete failed`);
    }
  }
}
