import { NextResponse } from "next/server";
// var fs = require("fs");
import fs from "fs";
import path from "path";
import { pauseToJSON } from "#/lib/pauseData";
import { getConfigFromOrigin, updateFile } from "#/lib/server-action";

export async function GET(request: Request) {
  let res = "";
  try {
    // res = fs.readFileSync(path.join(process.cwd(), "lib", "test.txt"), "utf8");
    res = await getConfigFromOrigin();
    updateFile(path.join(process.cwd(), "lib", "test2.txt"), res);
    const total = pauseToJSON(res);
    let result: confDataType = {
      frps: total.slice(0, 1),
      frpc: total.slice(1),
    };
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
