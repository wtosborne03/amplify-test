# Step Functions Demo Setup

This guide explains the Step Functions demo implementation in your Next.js/Amplify app.

## Architecture

The demo includes:

1. **State Machine**: A workflow that validates, processes, and transforms data
2. **Task Lambda**: Executes individual steps (validate, process, transform)
3. **Trigger Lambda**: Starts executions and checks status
4. **Frontend Page**: UI to trigger and monitor executions

## State Machine Flow

```
Start → Validate → [Is Valid?]
                      ├─ Yes → Process → Transform → Success
                      └─ No → Fail
```

## Deployment Steps

1. **Install dependencies** for the Lambda functions:
   ```bash
   cd amplify/functions/step-function-task
   npm install
   cd ../step-function-trigger
   npm install
   cd ../../..
   ```

2. **Deploy the backend**:
   ```bash
   npx ampx sandbox
   ```

3. **Get the Trigger Lambda URL** (after deployment):
   - Go to AWS Console → Lambda
   - Find the `step-function-trigger` function
   - Enable Function URL if not already enabled
   - Copy the Function URL

4. **Set environment variable**:
   Create a `.env.local` file in the project root:
   ```
   STEP_FUNCTION_TRIGGER_URL=https://your-function-url.lambda-url.region.on.aws/
   ```

5. **Restart your dev server**:
   ```bash
   npm run dev
   ```

## Usage

1. Navigate to `/step-functions` in your app
2. Enter a positive number (e.g., 42) to pass validation
3. Click "Start Execution"
4. Click "Refresh Status" to check execution progress
5. View the output when execution completes

## Testing Different Scenarios

- **Valid input**: Enter a positive number (e.g., 42) → Execution succeeds
- **Invalid input**: Enter 0 or negative number → Execution fails at validation
- **Check status**: Use the refresh button to monitor long-running executions

## Files Created

- `amplify/functions/step-function-task/` - Lambda that executes state machine tasks
- `amplify/functions/step-function-trigger/` - Lambda that starts/monitors executions
- `amplify/custom/step-functions/resource.ts` - CDK code for state machine
- `app/step-functions/page.tsx` - Frontend demo page
- `app/api/step-functions/route.ts` - API route for frontend

## Customization

To modify the state machine workflow, edit:
- `amplify/custom/step-functions/resource.ts` - Change the workflow definition
- `amplify/functions/step-function-task/handler.ts` - Add new task types

## Troubleshooting

If executions fail:
1. Check CloudWatch Logs for the Lambda functions
2. Verify IAM permissions in the AWS Console
3. Ensure the state machine ARN is set correctly in the trigger Lambda
4. Check that the Function URL is enabled and accessible
