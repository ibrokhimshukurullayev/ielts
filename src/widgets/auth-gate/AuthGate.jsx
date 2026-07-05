"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, hasAnyUser } from "@/src/features";

const PUBLIC_ROUTES = ["/login", "/register"];

export function AuthGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    (async () => {
      const user = await getCurrentUser();
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      if (!user && !isPublicRoute) {
        router.replace((await hasAnyUser()) ? "/login" : "/register");
        return;
      }
      if (user && isPublicRoute) {
        router.replace(user.role === "TEACHER" ? "/teacher" : "/");
        return;
      }
      if (user?.role === "TEACHER" && !pathname.startsWith("/teacher") && pathname !== "/profile") {
        router.replace("/teacher");
        return;
      }
      if (user && user.role !== "TEACHER" && pathname.startsWith("/teacher")) {
        router.replace("/");
        return;
      }
      setReady(true);
    })();
  }, [pathname, router]);

  if (!ready) return null;
  return children;
}
