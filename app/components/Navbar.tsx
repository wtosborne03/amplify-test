"use client";

import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
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
                    <Box sx={{ flexGrow: 1 }} />
                    <AuthButton />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
