import { defineFunction } from '@aws-amplify/backend';

export const fulfillOrder = defineFunction({
    name: 'fulfill-order',
    entry: './handler.ts',
    timeoutSeconds: 10,
});
