import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';
import { Amplify } from 'aws-amplify';
import config from '@/amplify_outputs.json';

// Configure Amplify for server-side
Amplify.configure(config, { ssr: true });

export const { runWithAmplifyServerContext } = createServerRunner({
    config,
});

export async function AuthGetCurrentUserServer() {
    try {
        const currentUser = await runWithAmplifyServerContext({
            nextServerContext: { cookies },
            operation: (contextSpec) => fetchAuthSession(contextSpec),
        });
        return currentUser;
    } catch (error) {
        console.error(error);
    }
}
