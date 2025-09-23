import FrpcConfDrawer from "@/components/client/frpc-conf-drawer";
import FrpcDescriptions from "@/components/server/frpc-descriptions";
import { getConf } from "@/lib/server-action";
import { ClientCommonConfig } from "@/types/frpc";

export default async function FrpcViewPage() {
  const data = (await getConf()) || {};
  const { proxies, ...frpc } = data;
  console.log("frpc", data);
  return (
    <div className="p-3 space-y-5">
      <FrpcDescriptions bordered items={frpc} />
      <FrpcConfDrawer value={{ ...frpc } as ClientCommonConfig} />
    </div>
  );
}
