"use client";

import { useState, useEffect } from "react";
import { getUrl, remove, list } from "aws-amplify/storage";
import { fetchAuthSession } from "aws-amplify/auth";
import { useProfilePhotoUpload } from "./useProfilePhotoUpload";

export function useProfilePhoto(userId?: string) {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { uploadPhoto: uploadToLambda, uploading, error: uploadError } = useProfilePhotoUpload();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPhoto();
    }, [userId]);

    // Sync upload error with local error state
    useEffect(() => {
        if (uploadError) {
            setError(uploadError);
        }
    }, [uploadError]);

    const loadPhoto = async () => {
        setLoading(true);
        setError(null);

        try {
            let targetUserId = userId;

            // If no userId provided, get current user's ID
            if (!targetUserId) {
                const session = await fetchAuthSession();
                targetUserId = session.userSub;

                if (!targetUserId) {
                    setPhotoUrl(null);
                    return;
                }
            }

            // Try to load the JPEG version (created by Lambda)
            try {
                const result = await getUrl({
                    path: `profile-pictures/${targetUserId}/avatar.jpg`,
                });
                setPhotoUrl(result.url.toString());
                return;
            } catch {
                // JPEG not found, no photo uploaded yet
                setPhotoUrl(null);
            }
        } catch (err: any) {
            console.error("Error loading photo:", err);
            setError(err.message || "Failed to load photo");
            setPhotoUrl(null);
        } finally {
            setLoading(false);
        }
    };

    const uploadPhoto = async (file: File) => {
        const result = await uploadToLambda(file);

        if (result.success) {
            // Reload the photo to get the new URL
            await loadPhoto();
        }

        return result;
    };

    const deletePhoto = async () => {
        setError(null);

        try {
            // Get current user's ID (userSub)
            const session = await fetchAuthSession();
            const userSub = session.userSub;

            if (!userSub) {
                throw new Error("User not authenticated");
            }

            // List all files in user's profile-pictures folder
            const listResult = await list({
                path: `profile-pictures/${userSub}/`,
            });

            // Delete all files
            for (const item of listResult.items) {
                await remove({ path: item.path });
            }

            setPhotoUrl(null);
            return { success: true };
        } catch (err: any) {
            const errorMessage = err.message || "Failed to delete photo";
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    };

    return {
        photoUrl,
        loading,
        uploading,
        error,
        uploadPhoto,
        deletePhoto,
        reload: loadPhoto,
    };
}
