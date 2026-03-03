# Profile Photo Processing - Schema-Based Approach

## Overview

Profile photo upload with automatic processing using Amplify Gen 2's schema-based functions with full type safety.

## Architecture

```
Client → GraphQL Mutation → Lambda Function → S3
  ↓                              ↓
Upload                    Process & Resize
Image                     Convert to WebP
```

## How It Works

1. **Client uploads image** via typed GraphQL mutation
2. **Lambda processes** the image:
   - Resizes to 400x400px (main)
   - Creates 150x150px thumbnail
   - Converts both to WebP format
3. **Uploads to S3** at `profile-pictures/{userId}/`
4. **Returns URLs** to client

## Key Features

- **Type Safety**: Full TypeScript types from schema to handler
- **Automatic Processing**: No manual S3 upload needed
- **Optimized Images**: WebP format reduces file size by 25-35%
- **Thumbnails**: Pre-generated for lists/grids
- **Secure**: Uses Cognito authentication

## Files Structure

```
amplify/
  data/
    resource.ts              # Schema with uploadProfilePhoto mutation
  functions/
    process-profile-photo/
      handler.ts            # Typed Lambda handler
      resource.ts           # Function configuration
      package.json          # Dependencies (sharp, @aws-sdk/client-s3)
  backend.ts               # Connects everything

app/
  hooks/
    useProfilePhotoUpload.ts  # Client hook for upload
    useProfilePhoto.ts        # Combined hook with load/delete
```

## Usage

### Client-Side

```typescript
import { useProfilePhoto } from "@/app/hooks/useProfilePhoto";

const { photoUrl, uploading, uploadPhoto } = useProfilePhoto();

// Upload
await uploadPhoto(file);
```

### Schema Definition

```typescript
uploadProfilePhoto: a
  .mutation()
  .arguments({
    image: a.string().required(), // base64
  })
  .returns(a.json())
  .authorization(allow => [allow.authenticated()])
  .handler(a.handler.function('processProfilePhoto'))
```

### Handler Type Safety

```typescript
export const handler: Schema["uploadProfilePhoto"]["functionHandler"] = 
  async (event, context) => {
    const { image } = event.arguments; // Typed!
    const userId = context.identity.sub; // Typed!
    // ...
  };
```

## Deployment

```bash
npx ampx sandbox
```

## Benefits Over Previous Approach

1. **Type Safety**: Compile-time checks for arguments and return types
2. **Simpler Auth**: No need for Function URLs or IAM policies
3. **Better Integration**: Uses existing GraphQL API
4. **Automatic Codegen**: Client types generated automatically
5. **Cleaner Code**: No manual fetch() calls with auth headers

## Output

After upload:
- `profile-pictures/{userId}/avatar.webp` (400x400)
- `profile-pictures/{userId}/thumb-avatar.webp` (150x150)

## Monitoring

Check CloudWatch Logs for `process-profile-photo` function to see processing status and any errors.
