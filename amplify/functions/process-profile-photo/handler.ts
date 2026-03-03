import type { Schema } from '../../data/resource';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import Jimp from 'jimp';

const s3Client = new S3Client({});
const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME;

export const handler: Schema["uploadProfilePhoto"]["functionHandler"] = async (event, context) => {
    console.log('Processing profile photo upload');
    console.log('Full event:', JSON.stringify(event, null, 2));
    console.log("Full context: ", JSON.stringify(context, null, 2));

    const { image } = event.arguments;

    // In Amplify Gen 2, identity comes from event.identity
    const identity = (event as any).identity;
    const userId = identity?.sub || identity?.claims?.sub || identity?.username;

    console.log('Identity from event:', JSON.stringify(identity, null, 2));
    console.log('Extracted userId:', userId);

    if (!image) {
        return {
            success: false,
            error: 'Missing image',
        };
    }

    if (!userId) {
        console.error('User ID not found. Checked event.identity');
        return {
            success: false,
            error: 'User not authenticated',
        };
    }

    if (!BUCKET_NAME) {
        return {
            success: false,
            error: 'Storage bucket not configured',
        };
    }

    try {
        // Decode base64 image
        const imageBuffer = Buffer.from(image, 'base64');

        // Load image with Jimp
        const jimpImage = await Jimp.read(imageBuffer);

        // Process main image: resize to 400x400
        const processedImage = await jimpImage
            .clone()
            .cover(400, 400)
            .quality(85)
            .getBufferAsync(Jimp.MIME_JPEG);

        // Create thumbnail: 150x150
        const thumbnail = await jimpImage
            .clone()
            .cover(150, 150)
            .quality(80)
            .getBufferAsync(Jimp.MIME_JPEG);

        // Upload main image
        const mainKey = `profile-pictures/${userId}/avatar.jpg`;
        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: mainKey,
                Body: processedImage,
                ContentType: 'image/jpeg',
            })
        );
        console.log('Uploaded main image:', mainKey);

        // Upload thumbnail
        const thumbnailKey = `profile-pictures/${userId}/thumb-avatar.jpg`;
        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: thumbnailKey,
                Body: thumbnail,
                ContentType: 'image/jpeg',
            })
        );
        console.log('Uploaded thumbnail:', thumbnailKey);

        return {
            success: true,
            mainImage: mainKey,
            thumbnail: thumbnailKey,
        };
    } catch (error: any) {
        console.error('Error processing image:', error);
        return {
            success: false,
            error: error.message || 'Failed to process image',
        };
    }
};
