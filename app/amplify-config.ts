"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useEffect } from "react";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { CookieStorage } from "aws-amplify/utils";

export default function ConfigureAmplify() {
  useEffect(() => {
    Amplify.configure(outputs, { ssr: true });

    // Configure cookie storage for auth tokens
    cognitoUserPoolsTokenProvider.setKeyValueStorage(
      new CookieStorage({
        domain: typeof window !== "undefined" ? window.location.hostname : undefined,
        path: "/",
        expires: 365,
        sameSite: "lax",
        secure: typeof window !== "undefined" ? window.location.protocol === "https:" : false,
      })
    );
  }, []);

  return null;
}
