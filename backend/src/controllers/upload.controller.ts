import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/aws';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { generateId } from '../utils/id';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const createPresignedUrl = asyncHandler(async (req: Request, res: Response) => {
  const { fileName, fileType, folder } = req.body as {
    fileName: string;
    fileType: string;
    folder?: string;
  };

  if (!fileName || !fileType) {
    throw new AppError('fileName and fileType are required', 400);
  }

  if (!ALLOWED_TYPES.includes(fileType)) {
    throw new AppError('Unsupported file type', 415);
  }

  const key = `${folder ?? 'uploads'}/${generateId()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: env.s3.bucket,
    Key: key,
    ContentType: fileType,
    ACL: 'public-read'
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  res.json({
    uploadUrl: signedUrl,
    fileUrl: env.s3.cloudfrontUrl ? `${env.s3.cloudfrontUrl}/${key}` : `https://${env.s3.bucket}.s3.${env.s3.region}.amazonaws.com/${key}`
  });
});
