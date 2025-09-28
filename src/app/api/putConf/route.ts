import { updateFile } from "@/lib/getBaseUrl";
import { JsonToFrps } from "@/lib/pauseData";
import { NextRequest, NextResponse } from "next/server";
import path from "node:path";

export async function PUT(request: NextRequest) {
  try {
    // 获取json数据
    let data = await request.json();
    // let res = await request.formData();
    // res.forEach((value, key) => {
    //   console.log(key, value);
    // });

    let confText = JsonToFrps(data);
    // let res = await putConfigToOrigin(confText);
    // let ress = await reloadConfig();
    updateFile(path.join(process.cwd(), "lib", "test.txt"), confText);

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    return NextResponse.json({ status: error.message });
  }
}
