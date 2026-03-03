# Server-Side Authentication Utilities

## Overview

The `auth-server.ts` module provides utilities for server-side authentication in Next.js App Router with AWS Amplify.

## Usage

### In Server Components

```tsx
import { getCurrentUser } from "@/app/lib/auth-server";

export default async function MyPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.email}!</div>;
}
```

### In Server Actions

```tsx
"use server";

import { getCurrentUser } from "@/app/lib/auth-server";

export async function myAction() {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }
  
  // Use user.identityId for S3 operations
  // Use user.userId for database operations
  
  return { success: true };
}
```

## API

### `getCurrentUser()`

Returns the authenticated user or `null` if not authenticated.

**Returns:** `Promise<AuthUser | null>`

```typescript
interface AuthUser {
  userId: string;        // Cognito User Sub (for database)
  identityId: string;    // Cognito Identity ID (for S3)
  email?: string;
  nickname?: string;
  isAuthenticated: boolean;
}
```

### `isAuthenticated()`

Simple boolean check for authentication status.

**Returns:** `Promise<boolean>`

## Key Points

- Use `identityId` for S3 storage operations with `allow.entity('identity')`
- Use `userId` for database records and user identification
- These functions automatically handle the Amplify server context
- Works in both Server Components and Server Actions
