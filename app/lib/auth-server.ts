"use server";

import { AuthGetCurrentUserServer } from "../utils/amplify-utils";

export interface AuthUser {
    userId: string;
    identityId: string;
    email?: string;
    nickname?: string;
    isAuthenticated: boolean;
}

/**
 * Get the current authenticated user on the server side
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const session = await AuthGetCurrentUserServer();

        if (!session || !session.tokens) {
            return null;
        }

        return {
            userId: session.userSub || "",
            identityId: session.identityId || "",
            email: session.tokens.idToken?.payload.email as string,
            nickname: session.tokens.idToken?.payload.nickname as string,
            isAuthenticated: true,
        };
    } catch (error) {
        console.error("Auth error:", error);
        return null;
    }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return user !== null;
}
