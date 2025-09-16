import { NextResponse } from "next/server";
import { getAuth } from "@/lib/token";

// 获取配置文件
export async function GET(request: Request) {
  const authorization = await getAuth(request);
  if (!authorization) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/config`, {
    headers: {
      authorization,
    },
  });
  const config = await res.text();
  return NextResponse.json(config);
}

// // 更新配置文件
// export async function PUT(request: Request) {
//   const body = await request.json();
//   const res = await fetch(`${process.env.ORIGIN_SERVER}/api/config`, {
//     method: "PUT",
//     headers: request.headers,
//     body: JSON.stringify(body),
//   });
//   const msg = await res.json();
//   return NextResponse.json({
//     code: 200,
//     msg: "更新成功",
//     data: msg,
//   });
// }
