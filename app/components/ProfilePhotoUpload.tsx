"use client";

import { useRef } from "react";
import {
    Box,
    Avatar,
    Button,
    IconButton,
    CircularProgress,
    Alert,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import { useProfilePhoto } from "../hooks/useProfilePhoto";

interface ProfilePhotoUploadProps {
    userId?: string;
    onUploadComplete?: (url: string) => void;
    size?: number;
}

export default function ProfilePhotoUpload({
    userId,
    onUploadComplete,
    size = 120,
}: ProfilePhotoUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { photoUrl, uploading, error, uploadPhoto, deletePhoto } = useProfilePhoto(userId);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const result = await uploadPhoto(file);

        if (result.success && result.mainImage) {
            onUploadComplete?.(result.mainImage);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDelete = async () => {
        if (!photoUrl) return;

        const result = await deletePhoto();

        if (result.success) {
            onUploadComplete?.("");
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Box sx={{ position: "relative" }}>
                <Avatar
                    src={photoUrl || undefined}
                    sx={{
                        width: size,
                        height: size,
                        bgcolor: "primary.main",
                        fontSize: size / 3,
                    }}
                >
                    {!photoUrl && "U"}
                </Avatar>

                {uploading && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            borderRadius: "50%",
                        }}
                    >
                        <CircularProgress size={40} sx={{ color: "white" }} />
                    </Box>
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{ width: "100%" }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ display: "flex", gap: 1 }}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                />

                <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {photoUrl ? "Change Photo" : "Upload Photo"}
                </Button>

                {photoUrl && (
                    <IconButton
                        color="error"
                        onClick={handleDelete}
                        disabled={uploading}
                        size="small"
                    >
                        <Delete />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}
