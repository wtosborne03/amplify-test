"use client";

import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export function useProfilePhotoUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadPhoto = async (file: File) => {
        setUploading(true);
        setError(null);

        try {
            // Validate file
            if (!file.type.startsWith("image/")) {
                throw new Error("File must be an image");
            }

            if (file.size > 5 * 1024 * 1024) {
                throw new Error("File size must be less than 5MB");
            }

            // Convert file to base64
            const base64Image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    // Remove data URL prefix (e.g., "data:image/png;base64,")
                    const base64 = result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Call the query with base64 image
            const { data: result, errors } = await client.queries.uploadProfilePhoto(
                {
                    image: base64Image,
                },
                {
                    authMode: 'userPool',
                }
            );

            if (errors) {
                throw new Error(errors[0]?.message || "Failed to upload photo");
            }

            if (result && typeof result === 'object') {
                const response = result as any;

                if (response.success) {
                    return {
                        success: true,
                        mainImage: response.mainImage,
                        thumbnail: response.thumbnail,
                    };
                } else {
                    throw new Error(response.error || "Failed to upload photo");
                }
            }

            throw new Error("Invalid response from server");
        } catch (err: any) {
            const errorMessage = err.message || "Failed to upload photo";
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        } finally {
            setUploading(false);
        }
    };

    return {
        uploadPhoto,
        uploading,
        error,
    };
}
