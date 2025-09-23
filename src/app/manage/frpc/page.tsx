import DynamicTable from "@/components/client/dynamic-table";
import FrpcDescriptions from "@/components/server/frpc-descriptions";
import { getConf } from "@/lib/server-action";
import { Button } from "antd";

export default async function FrpcViewPage() {
  const data = (await getConf()) || {};
  const { proxies, ...frpc } = data;
  console.log("frpc", data);
  return (
    <div className="p-3 space-y-5">
      <FrpcDescriptions bordered items={frpc} />
      <Button type="primary">修改基础配置</Button>
    </div>
  );
}
