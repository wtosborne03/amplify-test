import { defineFunction } from '@aws-amplify/backend';

export const processProfilePhoto = defineFunction({
    name: 'process-profile-photo',
    entry: './handler.ts',
    timeoutSeconds: 30,
    memoryMB: 512,
    environment: {
        // Will be set in backend.ts
    },
});
