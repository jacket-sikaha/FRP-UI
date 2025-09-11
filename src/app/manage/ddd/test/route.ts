import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Type", "application/json");
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/status`, {
    method: "GET",
    headers: requestHeaders,
  });
  const aaa = await res.json();
  return NextResponse.json(aaa);
}
