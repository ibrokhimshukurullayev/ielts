"use client";

import { useEffect } from "react";
import { applyTheme, getStoredTheme } from "@/src/shared";

export function ThemeInit() {
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  return null;
}
