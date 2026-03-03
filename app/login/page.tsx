"use client";

import { signIn } from "aws-amplify/auth";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Link as MuiLink,
    Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { isSignedIn, nextStep } = await signIn({
                username: email,
                password,
            });

            if (isSignedIn) {
                router.push("/");
            } else if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
                setError("Please verify your email before signing in");
            }
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

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
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Sign in to your LinkedOut account
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSignIn}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            autoFocus
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                        />

                        <Box sx={{ textAlign: "right", mt: 1 }}>
                            <Link href="/forgot-password" passHref legacyBehavior>
                                <MuiLink variant="body2">Forgot password?</MuiLink>
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>

                        <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                OR
                            </Typography>
                        </Divider>

                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                New to LinkedOut?{" "}
                                <Link href="/register" passHref legacyBehavior>
                                    <MuiLink>Join now</MuiLink>
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
