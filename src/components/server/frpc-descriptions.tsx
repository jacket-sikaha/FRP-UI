import { Descriptions } from "antd";
import React from "react";

function DescriptionsItem({ obj }: { obj: Record<string, unknown> }) {
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
  return <Descriptions bordered={false} items={itemsArray} />;
}

function FrpcDescriptions({
  title = "Info",
  items = {},
  bordered = false,
}: {
  title: string;
  items: Record<string, unknown>;
  bordered?: boolean;
}) {
  const itemsArray = Object.entries(items).map(([key, value]) => ({
    label: key,
    span: 2,
    children: (
      <div>
        {(typeof value === "object" ? (
          <DescriptionsItem obj={value as Record<string, unknown>} />
        ) : (
          (value as string)
        )) ?? "-"}
      </div>
    ),
  }));
  return <Descriptions title={title} bordered={bordered} items={itemsArray} />;
}

export default FrpcDescriptions;
