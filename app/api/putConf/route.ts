import { JsonToFrps } from "#/lib/pauseData";
import {
  putConfigToOrigin,
  reloadConfig,
  updateFile,
} from "#/lib/server-action";
import { NextResponse } from "next/server";
import path from "node:path";

export async function PUT(request: Request, context: any) {
  try {
    // 获取json数据
    let data = await request.json();
    // let res = await request.formData();
    // res.forEach((value, key) => {
    //   console.log(key, value);
    // });

    console.log("data", data);
    let confText = JsonToFrps(data);
    let res = await putConfigToOrigin(confText);
    let ress = await reloadConfig();
    updateFile(path.join(process.cwd(), "lib", "test.txt"), confText);

    return NextResponse.json({ status: "success", ress, res });
  } catch (error: any) {
    return NextResponse.json({ status: error.message });
  }
}
