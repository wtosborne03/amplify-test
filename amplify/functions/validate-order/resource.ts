import { defineFunction } from '@aws-amplify/backend';

export const validateOrder = defineFunction({
    name: 'validate-order',
    entry: './handler.ts',
    timeoutSeconds: 10,
});
