# Profile Photo Processing - Direct File Upload

## Overview

Direct file upload to S3 with automatic Lambda processing triggered by S3 events.

## Architecture

```
Client → S3 Direct Upload → Lambda Trigger → Process & Save
  ↓                              ↓
File                         Resize & Convert
Upload                       to WebP
```

## How It Works

1. **Client uploads file directly to S3**
   - Uses Amplify Storage `uploadData()`
   - Uploads to `profile-pictures/{userId}/original-{timestamp}.{ext}`
   - No base64 encoding needed!

2. **S3 triggers Lambda automatically**
   - Lambda receives S3 event notification
   - Downloads the original file

3. **Lambda processes the image**
   - Resizes to 400x400px (main)
   - Creates 150x150px thumbnail
   - Converts both to WebP format

4. **Lambda saves processed images**
   - Uploads `avatar.webp` (main)
   - Uploads `thumb-avatar.webp` (thumbnail)
   - Deletes original file to save space

5. **Client loads processed image**
   - Waits 2 seconds for processing
   - Loads `avatar.webp` from S3

## Benefits

✅ **Direct Upload**: No base64 encoding overhead  
✅ **Smaller Payloads**: File goes straight to S3  
✅ **Automatic Processing**: Lambda triggered by S3 event  
✅ **Efficient**: Original file deleted after processing  
✅ **Type Safe**: Uses Amplify Storage SDK  

## File Flow

```
Upload:
profile-pictures/{userId}/original-1234567890.jpg

Processing:
→ Download original
→ Resize & convert
→ Upload avatar.webp
→ Upload thumb-avatar.webp
→ Delete original

Result:
profile-pictures/{userId}/avatar.webp (400x400)
profile-pictures/{userId}/thumb-avatar.webp (150x150)
```

## Code Example

### Client Upload

```typescript
import { uploadData } from "aws-amplify/storage";

const result = await uploadData({
  path: `profile-pictures/${userId}/original-${Date.now()}.jpg`,
  data: file, // Direct File object!
  options: {
    contentType: file.type,
  },
}).result;
```

### Lambda Handler

```typescript
export const handler: S3Handler = async (event) => {
  for (const record of event.Records) {
    const key = record.s3.object.key;
    
    // Download original
    const image = await s3.getObject({ Key: key });
    
    // Process with Sharp
    const processed = await sharp(image)
      .resize(400, 400)
      .webp({ quality: 85 })
      .toBuffer();
    
    // Upload processed
    await s3.putObject({
      Key: `profile-pictures/${userId}/avatar.webp`,
      Body: processed,
    });
    
    // Delete original
    await s3.deleteObject({ Key: key });
  }
};
```

## Configuration

### S3 Trigger

```typescript
s3Bucket.addEventNotification(
  EventType.OBJECT_CREATED,
  new LambdaDestination(photoProcessor),
  { prefix: 'profile-pictures/' }
);
```

### Lambda Permissions

```typescript
s3Bucket.grantReadWrite(photoProcessor);
s3Bucket.grantDelete(photoProcessor);
```

## Deployment

```bash
npx ampx sandbox
```

## Monitoring

Check CloudWatch Logs for `process-profile-photo` to see:
- S3 event details
- Processing status
- Upload confirmations
- Any errors

## Performance

- **Upload**: Direct to S3 (fast)
- **Processing**: ~1-2 seconds
- **Total**: ~2-3 seconds end-to-end

## Comparison with Base64 Approach

| Aspect | Direct Upload | Base64 |
|--------|--------------|--------|
| Client payload | Small (metadata only) | Large (entire file) |
| Network efficiency | High | Low |
| Lambda payload limit | No issue | 6MB limit |
| Processing trigger | S3 event | API call |
| Type safety | Full | Full |
| Complexity | Simple | Simple |

## Best For

- Large images (>1MB)
- Mobile uploads
- Slow connections
- Production apps
