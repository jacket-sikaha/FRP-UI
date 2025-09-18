import FrpcDescriptions from "@/components/server/frpc-descriptions";
import { getConf } from "@/lib/server-action";

export default async function FrpcViewPage() {
  const data = (await getConf()) || {};
  const { proxies, ...frpc } = data;
  console.log("frpc", data);
  return (
    <div>
      <FrpcDescriptions bordered items={frpc} />
    </div>
  );
}
