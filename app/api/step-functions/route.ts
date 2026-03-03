import { NextRequest, NextResponse } from 'next/server';
import { runWithAmplifyServerContext } from '@/app/amplify-utils';
import { fetchAuthSession } from 'aws-amplify/auth/server';

const TRIGGER_FUNCTION_URL = process.env.STEP_FUNCTION_TRIGGER_URL;

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await runWithAmplifyServerContext({
            nextServerContext: { request },
            operation: (contextSpec) => fetchAuthSession(contextSpec),
        });

        if (!session.tokens) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // For now, we'll use a direct Lambda invocation approach
        // In production, you'd want to use the Amplify Data API or a custom resolver

        // Placeholder response - you'll need to configure the actual Lambda URL
        if (!TRIGGER_FUNCTION_URL) {
            return NextResponse.json(
                {
                    error: 'Step Functions not configured',
                    message: 'Please deploy the backend and set STEP_FUNCTION_TRIGGER_URL environment variable'
                },
                { status: 503 }
            );
        }

        const response = await fetch(TRIGGER_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Step Functions API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
