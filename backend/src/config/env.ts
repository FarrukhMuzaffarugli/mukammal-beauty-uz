import dotenv from 'dotenv';

dotenv.config();

const required = (value: string | undefined, key: string, fallback?: string) => {
  if (value && value.trim().length > 0) {
    return value;
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw new Error(`Environment variable ${key} is required`);
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8000),
  mongoUri: required(process.env.MONGO_URI, 'MONGO_URI'),
  jwt: {
    secret: required(process.env.JWT_SECRET, 'JWT_SECRET'),
    refreshSecret: required(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d'
  },
  s3: {
    region: required(process.env.AWS_REGION, 'AWS_REGION'),
    bucket: required(process.env.AWS_S3_BUCKET, 'AWS_S3_BUCKET'),
    accessKeyId: required(process.env.AWS_ACCESS_KEY_ID, 'AWS_ACCESS_KEY_ID'),
    secretAccessKey: required(process.env.AWS_SECRET_ACCESS_KEY, 'AWS_SECRET_ACCESS_KEY'),
    cloudfrontUrl: process.env.CLOUDFRONT_URL ?? ''
  },
  corsOrigins: (process.env.CORS_ORIGINS ?? '').split(',').map((origin) => origin.trim()).filter(Boolean)
};

export const isProd = env.nodeEnv === 'production';
