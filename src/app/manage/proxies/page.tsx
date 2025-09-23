import DynamicTable from "@/components/client/dynamic-table";
import { getConf } from "@/lib/server-action";

export default async function EditProxiesPage() {
  const data = (await getConf()) || {};
  const { proxies, ...frpc } = data;
  console.log("EditProxiesPage", data);
  return (
    <div className="w-full p-3 h-full flex flex-col items-center bg-white">
      <DynamicTable obj={proxies as Record<string, unknown>[]} />
    </div>
  );
}
