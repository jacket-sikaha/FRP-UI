import { NextResponse } from "next/server";

// 更新配置文件
export async function PUT(request: Request) {
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/config`, {
    method: "PUT",
    headers: request.headers,
  });
  const msg = await res.json();
  return NextResponse.json({
    code: 200,
    msg: "更新成功",
    data: msg,
  });
}
