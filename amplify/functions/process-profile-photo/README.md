# Profile Photo Processor

This Lambda function automatically processes profile photos uploaded to S3.

## Features

- **Automatic Resizing**: Resizes images to 400x400px for profile photos
- **Thumbnail Generation**: Creates 150x150px thumbnails
- **WebP Conversion**: Converts all images to WebP format for optimal file size
- **Quality Optimization**: Uses 85% quality for main images, 80% for thumbnails

## How It Works

1. User uploads a profile photo (any format: JPG, PNG, etc.)
2. S3 triggers this Lambda function when a file is uploaded to `profile-pictures/`
3. Lambda processes the image:
   - Downloads the original image
   - Creates a 400x400 WebP version at `profile-pictures/{userId}/avatar.webp`
   - Creates a 150x150 WebP thumbnail at `profile-pictures/{userId}/thumb-avatar.webp`
4. Frontend automatically loads the WebP version if available

## File Structure

```
profile-pictures/
  {userId}/
    avatar.jpg          # Original upload (can be deleted after processing)
    avatar.webp         # Processed 400x400 image
    thumb-avatar.webp   # Thumbnail 150x150 image
```

## Dependencies

- `sharp`: High-performance image processing
- `@aws-sdk/client-s3`: S3 operations

## Configuration

- **Memory**: 512 MB
- **Timeout**: 30 seconds
- **Trigger**: S3 ObjectCreated events in `profile-pictures/` prefix

## Testing

After deploying, upload a profile photo through the app. Check CloudWatch Logs for the Lambda function to see processing details.
