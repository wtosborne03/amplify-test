import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'linkedoutStorage',
    access: (allow) => ({
        'profile-pictures/*': [
            allow.authenticated.to(['read', 'write', 'delete']),
        ],
        'public/*': [
            allow.guest.to(['read']),
            allow.authenticated.to(['read', 'write', 'delete']),
        ],
    }),
});
