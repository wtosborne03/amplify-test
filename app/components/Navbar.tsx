"use client";

import { AppBar, Toolbar, Typography, Box, Container, Button } from "@mui/material";
import AuthButton from "./AuthButton";
import Link from "next/link";

export default function Navbar() {
    return (
        <AppBar position="static">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 0, fontWeight: 700, mr: 4 }}
                        >
                            LinkedOut
                        </Typography>
                    </Link>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Link href="/step-functions" passHref legacyBehavior>
                            <Button color="inherit" component="a">
                                Step Functions
                            </Button>
                        </Link>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <AuthButton />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
