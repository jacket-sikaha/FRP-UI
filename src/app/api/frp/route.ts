import { pauseToJSON } from "@/lib/pauseData";
import { getConfigFromOrigin } from "@/lib/server-action";
import { NextResponse } from "next/server";

export async function GET() {
  let res = "";
  try {
    // res = fs.readFileSync(path.join(process.cwd(), "lib", "test.txt"), "utf8");
    res = await getConfigFromOrigin();
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
