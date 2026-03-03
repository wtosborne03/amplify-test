import { defineFunction } from '@aws-amplify/backend';

export const stepFunctionTrigger = defineFunction({
    name: 'step-function-trigger',
    entry: './handler.ts',
});
