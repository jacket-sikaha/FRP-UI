import DynamicTable from "@/components/client/dynamic-table";
import { getConf } from "@/lib/server-action";
import { FrpcConfig } from "@/types/frpc";
import { randomUUID } from "crypto";
import { produce } from "immer";

export default async function EditProxiesPage() {
  const data = (await getConf()) || {};
  const frpc = produce(data as FrpcConfig, (draft) => {
    draft.proxies = draft.proxies || [];
    draft.proxies.forEach((item) => {
      item.id = item?.id || randomUUID();
    });
  });

  console.log("EditProxiesPage", data);
  return (
    <div className="w-full p-3 h-full flex flex-col items-center bg-white">
      <DynamicTable frpc={frpc} />
    </div>
  );
}
