import { NextResponse } from "next/server";

// 重载配置文件
export async function GET(request: Request) {
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/reload`, {
    headers: request.headers,
  });
  const msg = await res.json();
  return NextResponse.json({
    code: 200,
    msg: "重载成功",
    data: msg,
  });
}
