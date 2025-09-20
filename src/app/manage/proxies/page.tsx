import ProxiesForm from "@/components/client/proxies-form";
import { Form } from "antd";

export default async function EditProxiesPage() {
  return (
    <div className="w-full h-full flex flex-col items-center bg-white">
      <ProxiesForm />
    </div>
  );
}
