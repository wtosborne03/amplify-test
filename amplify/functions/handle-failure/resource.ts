import { defineFunction } from '@aws-amplify/backend';

export const handleFailure = defineFunction({
    name: 'handle-failure',
    entry: './handler.ts',
    timeoutSeconds: 10,
});
