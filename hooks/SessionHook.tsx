"use client";

import { useSession } from "next-auth/react";

export default function SessionHook() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}