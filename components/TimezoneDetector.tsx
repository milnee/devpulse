"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * Detects the browser's UTC offset (in minutes) and appends ?tz=<offset>
 * to the URL so the server can compute timezone-aware streaks.
 * Runs only once on mount; does nothing if ?tz is already present.
 */
export function TimezoneDetector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("tz")) {
      // getTimezoneOffset() returns minutes WEST of UTC; negate for east
      const offset = -new Date().getTimezoneOffset();
      const params = new URLSearchParams(searchParams.toString());
      params.set("tz", String(offset));
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
