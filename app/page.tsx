import { Container, Typography, Box, Button } from "@mui/material";
import Link from "next/link";
import { getCurrentUser } from "./lib/auth-server";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          textAlign: "center",
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
          Welcome to LinkedOut
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
          {user
            ? `Welcome back, ${user.nickname || user.email || 'User'}!`
            : "Connect with professionals, build your network, and advance your career"
          }
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          {user ? (
            <>
              <Link href="/profile" style={{ textDecoration: "none" }}>
                <Button variant="contained" size="large">
                  View Profile
                </Button>
              </Link>
              <Link href="/about" style={{ textDecoration: "none" }}>
                <Button variant="outlined" size="large">
                  About
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/register" style={{ textDecoration: "none" }}>
                <Button variant="contained" size="large">
                  Join Now
                </Button>
              </Link>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <Button variant="outlined" size="large">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
