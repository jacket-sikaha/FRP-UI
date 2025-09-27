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
  if (!res.ok) {
    return NextResponse.error();
  }
  const config = await res.text();
  return NextResponse.json(config);
}

// // 更新配置文件
export async function PUT(request: Request) {
  const Authorization = await getAuth(request);
  if (!Authorization) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const data = await request.text();
  console.log("data111111111111111:", data.slice(0, 130));
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/config`, {
    method: "PUT",
    headers: request.headers,
    body: data,
  });
  const msg = await res.text();
  console.log("first", res.ok, msg);
  if (!res.ok) {
    return NextResponse.error();
  }
  return NextResponse.json({
    code: 200,
    msg: "更新成功",
    data: msg,
  });
}
