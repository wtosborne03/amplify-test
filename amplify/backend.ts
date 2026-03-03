import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { processProfilePhoto } from './functions/process-profile-photo/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  processProfilePhoto,
});

// Get the S3 bucket and Lambda function
const s3Bucket = backend.storage.resources.bucket;
const lambdaFunction = backend.processProfilePhoto.resources.lambda;

// Grant the Lambda function read/write permissions to the S3 bucket
s3Bucket.grantReadWrite(lambdaFunction);

// Set environment variables for the Lambda function
backend.processProfilePhoto.addEnvironment('STORAGE_BUCKET_NAME', s3Bucket.bucketName);