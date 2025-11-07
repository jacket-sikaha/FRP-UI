import FrpEditor from "@/components/client/frp-editor";
import { getConf } from "@/lib/server-action";
import { Spin } from "antd";
import { Suspense } from "react";

export default async function FrpConfPage() {
  const frpcPromise = getConf(true).catch(() => "");

  return (
    <Suspense fallback={<Spin fullscreen tip="获取frpc配置中..." />}>
      <div className="flex flex-col items-center h-full">
        <div className="md:w-2xl max-w-4xl w-sm">
          <FrpEditor frpcPromise={frpcPromise} height="500" />
        </div>
      </div>
    </Suspense>
  );
}
