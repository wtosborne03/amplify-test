import { defineFunction } from '@aws-amplify/backend';

export const processPayment = defineFunction({
    name: 'process-payment',
    entry: './handler.ts',
    timeoutSeconds: 10,
});
