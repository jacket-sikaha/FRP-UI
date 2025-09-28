import FrpEditor from "@/components/client/frp-editor";
import { headers } from "next/headers";

export default async function FrpConfPage() {
  const header = await headers();
  const host = header.get("host");
  const cookieHeader = header.get("cookie") || "";
  // 2. 发起请求时，手动携带 cookie
  const res = await fetch(`http://${host}/frp-api/config`, {
    headers: {
      // 将客户端的 cookie 传递给目标接口
      Cookie: cookieHeader,
    },
    // 注意：服务端 fetch 默认不携带 cookie，必须显式设置
  });
  const conf = await res.json();

  return (
    <div className="flex flex-col items-center h-full">
      <div className="md:w-2xl max-w-4xl w-sm">
        <FrpEditor value={conf} height="500" />
      </div>
    </div>
  );
}
