import { NextRequest, NextResponse } from "next/server";
import { ensureUserCookie } from "./app/actions";

export default async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  
  await ensureUserCookie();

  return response
}

export const config = {
  matcher: ["/"],
};