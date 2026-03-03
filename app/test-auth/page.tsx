import { Container, Box, Typography, Paper } from "@mui/material";
import { getCurrentUser } from "../lib/auth-server";

export default async function TestAuthPage() {
    const user = await getCurrentUser();

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Server-Side Auth Test
                </Typography>

                <Paper sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Authentication Status
                    </Typography>

                    {user ? (
                        <>
                            <Typography color="success.main" sx={{ mb: 2 }}>
                                ✓ Authenticated
                            </Typography>

                            <Typography variant="body2" component="pre" sx={{
                                bgcolor: "grey.100",
                                p: 2,
                                borderRadius: 1,
                                overflow: "auto"
                            }}>
                                {JSON.stringify(user, null, 2)}
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography color="error.main" sx={{ mb: 2 }}>
                                ✗ Not Authenticated
                            </Typography>

                            <Typography variant="body2">
                                Please log in first. After logging in, refresh this page to see your auth status.
                            </Typography>
                        </>
                    )}
                </Paper>

                <Paper sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Instructions
                    </Typography>
                    <Typography variant="body2" component="div">
                        <ol>
                            <li>Log out if you're currently logged in</li>
                            <li>Log in again (this will set the auth cookies)</li>
                            <li>Refresh this page to see your server-side auth status</li>
                        </ol>
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}
