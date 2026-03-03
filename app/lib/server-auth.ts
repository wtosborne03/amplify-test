"use server";

import { cookies } from "next/headers";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import config from "@/amplify_outputs.json";

const { runWithAmplifyServerContext } = createServerRunner({
    config,
});

export interface AuthUser {
    userId: string;
    identityId: string;
    email?: string;
    isAuthenticated: boolean;
}

export async function getServerAuthSession() {
    const cookieStore = await cookies();

    return runWithAmplifyServerContext({
        nextServerContext: { cookies: () => Promise.resolve(cookieStore) },
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);

                console.log("Server session:", {
                    hasTokens: !!session.tokens,
                    hasIdentityId: !!session.identityId,
                    userSub: session.userSub,
                    identityId: session.identityId,
                });

                return session;
            } catch (error) {
                console.error("Session error:", error);
                return null;
            }
        },
    });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
    const session = await getServerAuthSession();

    if (!session || !session.identityId) {
        return null;
    }

    return {
        userId: session.userSub || session.identityId,
        identityId: session.identityId,
        isAuthenticated: true,
    };
}
