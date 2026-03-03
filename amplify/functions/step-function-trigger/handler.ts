import { SFNClient, StartExecutionCommand, DescribeExecutionCommand } from '@aws-sdk/client-sfn';
import type { Handler } from 'aws-lambda';

const sfnClient = new SFNClient({});

export const handler: Handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { action, executionArn, input } = body;

    try {
        if (action === 'start') {
            const stateMachineArn = process.env.STATE_MACHINE_ARN;

            if (!stateMachineArn) {
                throw new Error('STATE_MACHINE_ARN environment variable not set');
            }

            const command = new StartExecutionCommand({
                stateMachineArn,
                input: JSON.stringify(input || {}),
            });

            const response = await sfnClient.send(command);

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    executionArn: response.executionArn,
                    startDate: response.startDate,
                }),
            };
        } else if (action === 'describe') {
            const command = new DescribeExecutionCommand({
                executionArn,
            });

            const response = await sfnClient.send(command);

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    status: response.status,
                    startDate: response.startDate,
                    stopDate: response.stopDate,
                    output: response.output,
                    input: response.input,
                }),
            };
        }

        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Invalid action' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error'
            }),
        };
    }
};
