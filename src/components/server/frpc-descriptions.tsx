import { frpcCommonConfigZh } from "@/types/frpc-common-config-zh";
import { Descriptions, Tooltip } from "antd";
import ArrayDescriptions from "./array-descriptions";

export function DescriptionsItem({
  title = "Info",
  obj = {},
  bordered = false,
}: {
  title?: string;
  obj: Record<string, unknown> | string[];
  bordered?: boolean;
}) {
  const itemsArray = Object.entries(obj).map(([key, value]) => ({
    label: <Tooltip title={frpcCommonConfigZh[key] || key}>{key}</Tooltip>,
    children: (
      <div>
        {(typeof value === "object"
          ? JSON.stringify(value)
          : (value as string)) ?? "-"}
      </div>
    ),
  }));
  return Array.isArray(obj) ? (
    <ArrayDescriptions title={title} obj={obj} />
  ) : (
    <Descriptions title={title} bordered={bordered} items={itemsArray} />
  );
}

function FrpcDescriptions({
  items = {},
  bordered = false,
}: {
  items: Record<string, unknown>;
  bordered?: boolean;
}) {
  const itemsArray = Object.entries(items)
    .filter(([_, value]) => typeof value !== "object")
    .map(([key, value]) => ({
      label: <Tooltip title={frpcCommonConfigZh[key] || key}>{key}</Tooltip>,
      span: 2,
      children: <div>{(value as string) ?? "-"}</div>,
    }));

  return (
    <div className="flex flex-col gap-3">
      {itemsArray.length > 0 && (
        <Descriptions title={"FRPC Info"} bordered items={itemsArray} />
      )}
      {Object.entries(items)
        .filter(([_, value]) => typeof value === "object")
        .map(([key, value]) => (
          <DescriptionsItem
            key={key}
            title={frpcCommonConfigZh[key] || key}
            obj={value as Record<string, unknown>}
            bordered={bordered}
          />
        ))}
    </div>
  );
}

export default FrpcDescriptions;
