import DynamicTable from "@/components/client/dynamic-table";
import { getConf } from "@/lib/server-action";
import { FrpcConfig } from "@/types/frpc";
import { Spin } from "antd";
import { randomUUID } from "crypto";
import { produce } from "immer";
import { Suspense } from "react";

export default async function EditProxiesPage() {
  const frpcPromise = getConf()
    .then((res) => {
      return produce(res as FrpcConfig, (draft) => {
        draft.proxies = draft.proxies || [];
        draft.proxies.forEach((item) => {
          item.id = item?.id || randomUUID();
        });
      });
    })
    .catch((err) => {
      console.error("获取配置失败", err);
      return {} as FrpcConfig;
    });

  return (
    <Suspense fallback={<Spin fullscreen tip="获取frpc配置中..." />}>
      <div className="w-full p-3 h-full flex flex-col items-center">
        <DynamicTable frpcPromise={frpcPromise} />
      </div>
    </Suspense>
  );
}
