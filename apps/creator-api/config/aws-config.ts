import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { LambdaClient } from '@aws-sdk/client-lambda';

dotenv.config();

const region = process.env.AWS_REGION!;
const LAMBDA_FAUCET = process.env.AWS_LAMBDA_FAUCET_NAME;
const LAMBDA_REWARDS = process.env.AWS_LAMBDA_REWARDS_NAME;

const S3_CLIENT = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const LAMBDA_CLIENT = new LambdaClient({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const S3_BUCKET = process.env.AWS_S3_BUCKET!;

export { S3_CLIENT, S3_BUCKET, LAMBDA_CLIENT, LAMBDA_FAUCET, LAMBDA_REWARDS };
