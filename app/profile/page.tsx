"use client";

import { Container, Box, Typography, Paper, Button } from "@mui/material";
import { getCurrentUser, signOut, fetchUserAttributes } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfilePhotoUpload from "../components/ProfilePhotoUpload";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [attributes, setAttributes] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await getCurrentUser();
            const userAttributes = await fetchUserAttributes();
            setUser(currentUser);
            setAttributes(userAttributes);
        } catch {
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ py: 8, textAlign: "center" }}>
                    <Typography>Loading...</Typography>
                </Box>
            </Container>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 8 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Your Profile
                </Typography>

                <Paper sx={{ p: 4, mt: 4 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
                        <ProfilePhotoUpload
                            size={150}
                        />
                    </Box>

                    <Typography variant="h6" gutterBottom>
                        Account Information
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        <strong>Name:</strong> {attributes?.name || "Not set"}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Email:</strong> {attributes?.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Email Verified:</strong>{" "}
                        {attributes?.email_verified ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>User ID:</strong> {user.userId}
                    </Typography>

                    <Box sx={{ mt: 4 }}>
                        <Button variant="outlined" color="error" onClick={handleSignOut}>
                            Sign Out
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
