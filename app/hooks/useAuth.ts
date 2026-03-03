"use client";

import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import { useEffect, useState } from "react";

export function useAuth() {
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
            setUser(null);
            setAttributes(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        attributes,
        isAuthenticated: !!user,
        loading,
        userEmail: attributes?.email,
        userName: attributes?.name,
        userId: user?.userId,
        refresh: checkUser,
    };
}
