"use client";

import { Button, Box, Avatar, IconButton } from "@mui/material";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useProfilePhoto } from "../hooks/useProfilePhoto";

export default function AuthButton() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { photoUrl } = useProfilePhoto();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading) {
        return null;
    }

    if (user) {
        return (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <IconButton onClick={() => router.push("/profile")} sx={{ p: 0 }}>
                    <Avatar
                        src={photoUrl ?? undefined}
                        sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
                    >
                        {user.username?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                </IconButton>
                <Button variant="outlined" color="inherit" onClick={handleSignOut}>
                    Sign Out
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="text" color="inherit" onClick={() => router.push("/login")}>
                Sign In
            </Button>
            <Button variant="contained" onClick={() => router.push("/register")}>
                Join Now
            </Button>
        </Box>
    );
}
