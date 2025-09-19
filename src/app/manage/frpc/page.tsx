import DynamicTable from "@/components/client/dynamic-table";
import FrpcDescriptions from "@/components/server/frpc-descriptions";
import { getConf } from "@/lib/server-action";

export default async function FrpcViewPage() {
  const data = (await getConf()) || {};
  const { proxies, ...frpc } = data;
  console.log("frpc", data);
  return (
    <div>
      <div className="p-3">
        <FrpcDescriptions bordered items={frpc} />
      </div>
      <DynamicTable obj={proxies as Record<string, unknown>[]} />
    </div>
  );
}
