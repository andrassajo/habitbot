import { NextRequest, NextResponse } from "next/server";
import { ensureUserCookie } from "./lib/actions";

export default async function middleware(req: NextRequest) {
    await ensureUserCookie();

  NextResponse.next();
}

export const config = {
  matcher: ["/"],
};