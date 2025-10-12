import { getAuth } from "@/lib/token";
import { NextResponse } from "next/server";

// 重载配置文件
export async function GET(request: Request) {
  const Authorization = await getAuth(request);
  if (!Authorization) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/reload`, {
    headers: {
      Authorization,
    },
  });
  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }
  const msg = await res.text();
  return NextResponse.json({
    code: 200,
    msg: "重载成功",
    data: msg,
  });
}
