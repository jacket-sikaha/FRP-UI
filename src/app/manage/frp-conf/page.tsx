import FrpEditor from "@/components/client/frp-editor";
import { getConf } from "@/lib/server-action";

export default async function FrpConfPage() {
  const data = (await getConf(true)) || "";

  return (
    <div className="flex flex-col items-center h-full">
      <div className="md:w-2xl max-w-4xl w-sm">
        <FrpEditor value={data} height="500" />
      </div>
    </div>
  );
}
