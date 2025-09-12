import { NextResponse } from "next/server";

// 获取隧道信息
export async function GET(request: Request) {
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/status`, {
    headers: request.headers,
  });
  const data = await res.json();
  return NextResponse.json(data);
}
