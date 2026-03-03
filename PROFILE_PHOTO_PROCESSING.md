# Profile Photo Processing Setup

## Overview

Automatic image processing for profile photos using AWS Lambda and Sharp.

## What It Does

When a user uploads a profile photo:
1. Original image is uploaded to S3 at `profile-pictures/{userId}/avatar.{ext}`
2. Lambda function is triggered automatically
3. Lambda creates two optimized versions:
   - **Main photo**: 400x400px WebP (85% quality)
   - **Thumbnail**: 150x150px WebP (80% quality)
4. Frontend automatically loads the WebP version

## Benefits

- **Smaller file sizes**: WebP reduces file size by 25-35% compared to JPEG
- **Consistent dimensions**: All photos are properly sized
- **Automatic processing**: No manual intervention needed
- **Thumbnails ready**: Pre-generated thumbnails for lists/grids

## Files Created

```
amplify/
  functions/
    process-profile-photo/
      handler.ts          # Lambda function code
      resource.ts         # Function configuration
      package.json        # Dependencies
      tsconfig.json       # TypeScript config
  backend.ts             # Updated with S3 trigger
```

## Deployment

```bash
npx ampx sandbox
```

The Lambda function will be deployed and automatically triggered on profile photo uploads.

## Frontend Integration

The `useProfilePhoto` hook automatically:
- Tries to load WebP version first
- Falls back to original format if WebP not ready yet
- Handles loading states during processing

## Monitoring

Check CloudWatch Logs for the `process-profile-photo` function to see:
- Processing status
- Any errors
- Performance metrics

## Future Enhancements

Possible improvements:
- Add face detection for smart cropping
- Generate multiple sizes (small, medium, large)
- Add watermarking
- Implement progressive image loading
- Add AVIF format support
