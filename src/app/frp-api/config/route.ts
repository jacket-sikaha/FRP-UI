import { NextResponse } from "next/server";

// 获取配置文件
export async function GET(request: Request) {
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/status`, {
    headers: request.headers,
  });
  const config = await res.text();
  return NextResponse.json(config);
}
