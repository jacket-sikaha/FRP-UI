import { Descriptions } from "antd";
import React from "react";

function DescriptionsItem({
  title = "Info",
  obj = {},
  bordered = false,
}: {
  title?: string;
  obj: Record<string, unknown>;
  bordered?: boolean;
}) {
  const itemsArray = Object.entries(obj).map(([key, value]) => ({
    label: key,
    children: (
      <div>
        {(typeof value === "object"
          ? JSON.stringify(value)
          : (value as string)) ?? "-"}
      </div>
    ),
  }));
  return <Descriptions title={title} bordered={bordered} items={itemsArray} />;
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
      label: key,
      span: 2,
      children: <div>{(value as string) ?? "-"}</div>,
    }));
  return (
    <div className="flex flex-col gap-3">
      <Descriptions title={"FRPC Info"} bordered items={itemsArray} />
      {Object.entries(items)
        .filter(([_, value]) => typeof value === "object")
        .map(([key, value]) => (
          <DescriptionsItem
            key={key}
            title={key}
            obj={value as Record<string, unknown>}
            bordered={bordered}
          />
        ))}
    </div>
  );
}

export default FrpcDescriptions;
