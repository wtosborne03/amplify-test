import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { processProfilePhoto } from './functions/process-profile-photo/resource';
import { stepFunctionTask } from './functions/step-function-task/resource';
import { stepFunctionTrigger } from './functions/step-function-trigger/resource';
import { createStateMachine } from './custom/step-functions/resource';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  storage,
  processProfilePhoto,
  stepFunctionTask,
  stepFunctionTrigger,
});

// Get the S3 bucket and Lambda function
const s3Bucket = backend.storage.resources.bucket;
const lambdaFunction = backend.processProfilePhoto.resources.lambda;

// Grant the Lambda function read/write permissions to the S3 bucket
s3Bucket.grantReadWrite(lambdaFunction);

// Set environment variables for the Lambda function
backend.processProfilePhoto.addEnvironment('STORAGE_BUCKET_NAME', s3Bucket.bucketName);

// Create the Step Functions state machine
const taskLambda = backend.stepFunctionTask.resources.lambda;
const triggerLambda = backend.stepFunctionTrigger.resources.lambda;

const stateMachine = createStateMachine(
  backend.stepFunctionTrigger.resources.lambda,
  taskLambda,
  triggerLambda
);

// Set the state machine ARN as an environment variable for the trigger Lambda
backend.stepFunctionTrigger.addEnvironment('STATE_MACHINE_ARN', stateMachine.stateMachineArn);

// Add the trigger function to the data resource for API access
backend.data.addHttpDataSource(
  'stepFunctionApi',
  `https://${triggerLambda.functionName}.lambda-url.${backend.stepFunctionTrigger.resources.lambda.stack.region}.on.aws/`,
  {
    authorizationConfig: {
      signingRegion: backend.stepFunctionTrigger.resources.lambda.stack.region,
      signingServiceName: 'lambda',
    },
  }
);