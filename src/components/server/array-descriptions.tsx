import { Divider, Space } from "antd";
import React from "react";

function ArrayDescriptions({
  title,
  obj = [],
}: {
  title: string;
  obj: string[];
}) {
  return (
    <div className="flex items-center gap-6">
      <div className="text-base font-bold">{title}:</div>
      <Space
        split={<Divider type="vertical" style={{ borderColor: "#7cb305" }} />}
      >
        {obj.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </Space>
    </div>
  );
}

export default ArrayDescriptions;
