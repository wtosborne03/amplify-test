import type { Handler } from 'aws-lambda';

export const handler: Handler = async (event) => {
    console.log('Step Function Task received event:', JSON.stringify(event, null, 2));

    const { action, data } = event;

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    switch (action) {
        case 'process':
            return {
                statusCode: 200,
                result: 'processed',
                data: {
                    ...data,
                    processedAt: new Date().toISOString(),
                    processedBy: 'step-function-task'
                }
            };

        case 'validate':
            const isValid = data?.value && data.value > 0;
            return {
                statusCode: 200,
                result: 'validated',
                isValid,
                data
            };

        case 'transform':
            return {
                statusCode: 200,
                result: 'transformed',
                data: {
                    original: data,
                    transformed: JSON.stringify(data).toUpperCase(),
                    transformedAt: new Date().toISOString()
                }
            };

        default:
            return {
                statusCode: 200,
                result: 'completed',
                message: 'Task completed successfully',
                data
            };
    }
};
