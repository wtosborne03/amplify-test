# Authentication Setup Guide

## Problem
Client-side authentication (localStorage) doesn't persist to server-side operations, causing "User not authenticated" errors when uploading files or performing server actions.

## Solution
Configure Amplify to use cookie-based storage instead of localStorage.

## What Changed

### 1. Cookie Storage Configuration (`app/amplify-config.ts`)
- Added `CookieStorage` to store auth tokens in cookies
- Cookies are accessible to both client and server
- Tokens now persist across client/server boundary

### 2. Server-Side Auth Utility (`app/lib/auth-server.ts`)
- `getCurrentUser()` - Get authenticated user in Server Components and Server Actions
- `isAuthenticated()` - Simple boolean check
- Returns `identityId` for S3 operations and `userId` for database operations

### 3. Updated Profile Photo Actions (`app/actions/profile-photo.ts`)
- Uses `getCurrentUser()` to check auth before operations
- Uses `identityId` for S3 path (required for `allow.entity('identity')`)
- Properly passes `contextSpec` to `fetchAuthSession()`

## How to Test

### Step 1: Log Out and Back In
The cookie storage only takes effect after a fresh login:

1. Go to your profile page
2. Click "Sign Out"
3. Log in again
4. The auth tokens are now stored in cookies

### Step 2: Test Server-Side Auth
Visit `/test-auth` to verify server-side authentication is working:
- Should show "✓ Authenticated" with your user details
- If it shows "✗ Not Authenticated", you need to log out and back in

### Step 3: Test Profile Photo Upload
1. Go to `/profile`
2. Try uploading a profile photo
3. Should work without "User not authenticated" error

## Key Concepts

### Client vs Server Auth

**Before (localStorage):**
```
Client: ✓ Has tokens in localStorage
Server: ✗ Can't access localStorage → "Not authenticated"
```

**After (cookies):**
```
Client: ✓ Has tokens in cookies
Server: ✓ Can read cookies → Authenticated!
```

### Identity ID vs User ID

- `identityId`: Cognito Identity Pool ID - use for S3 storage paths
- `userId` (userSub): Cognito User Pool ID - use for database records

### Storage Access Pattern

```typescript
// Storage configuration uses entity_id
'profile-pictures/{entity_id}/*': [
  allow.entity('identity').to(['read', 'write', 'delete'])
]

// Server action uses identityId
const user = await getCurrentUser();
const path = `profile-pictures/${user.identityId}/avatar.jpg`;
```

## Usage Examples

### Server Component
```tsx
import { getCurrentUser } from "@/app/lib/auth-server";

export default async function MyPage() {
  const user = await getCurrentUser();
  
  return (
    <div>
      {user ? (
        <p>Welcome, {user.email}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Server Action
```tsx
"use server";

import { getCurrentUser } from "@/app/lib/auth-server";

export async function myAction() {
  const user = await getCurrentUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }
  
  // Use user.identityId for S3
  // Use user.userId for database
  
  return { success: true };
}
```

## Troubleshooting

### Still getting "Not authenticated"?
1. Clear your browser cookies
2. Log out completely
3. Log in again
4. Check `/test-auth` page

### Cookies not being set?
- Check browser console for errors
- Verify `window.location.hostname` is correct
- For localhost, cookies should work with `secure: false`
- For production, ensure HTTPS is enabled

### identityId is null?
- Make sure Cognito Identity Pool is properly configured
- Check that auth resource is deployed
- Verify `amplify_outputs.json` has identity pool configuration

## Next Steps

Now that SSR auth is working, you can:
- Add server-side route protection
- Prefetch user data in Server Components
- Perform authenticated operations in Server Actions
- Use conditional rendering based on auth state
