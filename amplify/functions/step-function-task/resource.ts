import { defineFunction } from '@aws-amplify/backend';

export const stepFunctionTask = defineFunction({
    name: 'step-function-task',
    entry: './handler.ts',
});
