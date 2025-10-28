import FrpcConfDrawer from "@/components/client/frpc-conf-drawer";
import FrpcDescriptions from "@/components/server/frpc-descriptions";
import { getConf } from "@/lib/server-action";
import { FrpcConfig } from "@/types/frpc";

export default async function FrpcViewPage() {
  const data = (await getConf()) || {};
  const { proxies, ...frpc } = data;
  return (
    <div className="p-3 space-y-5">
      <FrpcConfDrawer value={data as FrpcConfig} />
      <FrpcDescriptions bordered items={frpc} />
    </div>
  );
}
