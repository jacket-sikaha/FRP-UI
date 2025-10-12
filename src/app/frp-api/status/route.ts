import { getAuth } from "@/lib/token";
import { NextResponse } from "next/server";

// 获取隧道信息
export async function GET(request: Request) {
  const Authorization = await getAuth(request);
  if (!Authorization) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/status`, {
    headers: {
      Authorization,
    },
  });
  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status });
  }
  const data = (await res.json()) as StatusDataType;
  const tableData = Object.values(data || [])
    .flatMap((obj) => obj)
    .map((obj, index) => {
      obj.key = index;
      return obj;
    }) as StatusTableDataType[];
  return NextResponse.json(tableData);
}
