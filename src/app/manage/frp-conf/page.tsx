import FrpEditor from "@/components/client/frp-editor";
import { headers } from "next/headers";

export default async function FrpConfPage() {
  const header = await headers();
  const host = header.get("host");
  const cookieHeader = header.get("cookie") || "";
  console.log("cookieHeader", cookieHeader);
  // 2. 发起请求时，手动携带 cookie
  const res = await fetch(`http://${host}/frp-api/config`, {
    headers: {
      // 将客户端的 cookie 传递给目标接口
      Cookie: cookieHeader,
    },
    // 注意：服务端 fetch 默认不携带 cookie，必须显式设置
  });
  const conf = await res.json();
  // reloadConf
  const reloadConf = async () => {
    "use server";
    try {
      const res = await fetch(`http://${host}/frp-api/reload`, {
        headers: {
          Cookie: cookieHeader,
        },
      });
      const data = await res.json();
      console.log("data", data, res.ok);
      return res.ok;
    } catch (error) {
      return false;
    }
  };
  const updateConf = async (val?: string) => {
    "use server";
    if (!val) {
      return false;
    }
    try {
      const res = await fetch(`http://${host}/frp-api/config`, {
        method: "PUT",
        headers: {
          Cookie: cookieHeader,
        },
        body: JSON.stringify(val),
      });
      const data = await res.json();

      console.log("data", data, res.ok);
      return res.ok;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="md:w-2xl max-w-4xl w-sm">
        <FrpEditor
          value={conf}
          height="500"
          updateConf={updateConf}
          reloadConf={reloadConf}
        />
      </div>
    </div>
  );
}
