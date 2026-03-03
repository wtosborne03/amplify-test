"use client";

import { signUp, confirmSignUp, autoSignIn } from "aws-amplify/auth";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Link as MuiLink,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [needsConfirmation, setNeedsConfirmation] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email,
                        name,
                    },
                    autoSignIn: true,
                },
            });

            if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
                setNeedsConfirmation(true);
            }
        } catch (err: any) {
            setError(err.message || "Failed to sign up");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { isSignUpComplete } = await confirmSignUp({
                username: email,
                confirmationCode,
            });

            if (isSignUpComplete) {
                await autoSignIn();
                router.push("/");
            }
        } catch (err: any) {
            setError(err.message || "Failed to confirm sign up");
        } finally {
            setLoading(false);
        }
    };

    if (needsConfirmation) {
        return (
            <Container maxWidth="sm">
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 4,
                    }}
                >
                    <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Verify Your Email
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            We sent a verification code to {email}
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleConfirmSignUp}>
                            <TextField
                                fullWidth
                                label="Verification Code"
                                value={confirmationCode}
                                onChange={(e) => setConfirmationCode(e.target.value)}
                                margin="normal"
                                required
                                autoFocus
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ mt: 3 }}
                            >
                                {loading ? "Verifying..." : "Verify Email"}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Join LinkedOut
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Create your professional profile
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSignUp}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            margin="normal"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            helperText="Must be at least 8 characters"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? "Creating Account..." : "Join Now"}
                        </Button>

                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
