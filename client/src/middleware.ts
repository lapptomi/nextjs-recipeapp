import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country");

  // Skip country check if SKIP_COUNTRY_CHECK is set to true
  // This is useful for development and testing purposes
  if (process.env.SKIP_COUNTRY_CHECK === "true") {
    return NextResponse.next();
  }

  // Only allow requests from Finland when running in production
  if (process.env.NODE_ENV === "production") {
    if (!country || country !== "FI") {
      return NextResponse.json({ error: "Forbidden", status: 403 });
    }
  }

  return NextResponse.next();
}
