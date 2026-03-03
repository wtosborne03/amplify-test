"use client";

import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
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

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"request" | "confirm">("request");

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await resetPassword({ username: email });
            setSuccess("Verification code sent to your email");
            setStep("confirm");
        } catch (err: any) {
            setError(err.message || "Failed to send reset code");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await confirmResetPassword({
                username: email,
                confirmationCode: code,
                newPassword,
            });
            setSuccess("Password reset successful! Redirecting to login...");
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            setError(err.message || "Failed to reset password");
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
                        Reset Password
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {step === "request"
                            ? "Enter your email to receive a reset code"
                            : "Enter the code and your new password"}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    {step === "request" ? (
                        <Box component="form" onSubmit={handleResetPassword}>
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

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loading ? "Sending..." : "Send Reset Code"}
                            </Button>

                            <Box sx={{ textAlign: "center" }}>
                                <Link href="/login" passHref legacyBehavior>
                                    <MuiLink variant="body2">Back to Sign In</MuiLink>
                                </Link>
                            </Box>
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleConfirmReset}>
                            <TextField
                                fullWidth
                                label="Verification Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                margin="normal"
                                required
                                autoFocus
                            />

                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>

                            <Box sx={{ textAlign: "center" }}>
                                <Button
                                    variant="text"
                                    onClick={() => setStep("request")}
                                    disabled={loading}
                                >
                                    Resend Code
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    );
}
