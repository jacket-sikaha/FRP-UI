"use client";
import { Table, Tooltip } from "antd";
import React from "react";
import { proxiesZh } from "@/types/proxies-zh";
import FrpcDescriptions from "../server/frpc-descriptions";

function DynamicTable({ obj = [{}] }) {
  const tmp = Object.assign({}, ...obj);
  const children = Object.entries(tmp).filter(
    ([key, value]) => typeof value === "object"
  );
  const dynamicColumns = [
    ...Object.entries(tmp).map(([key, value]) => ({
      title: <Tooltip title={key}>{proxiesZh[key] || key}</Tooltip>,
      dataIndex: key,
      key: key,
    })),
  ];
  return (
    <div>
      <Table
        columns={dynamicColumns}
        dataSource={obj}
        expandable={{
          rowExpandable: (record) =>
            Object.entries(record).some(
              ([key, value]) => typeof value === "object"
            ),
          expandedRowRender: (record) => (
            <FrpcDescriptions
              bordered
              items={Object.fromEntries(
                Object.entries(record).filter(
                  ([key, value]) => typeof value === "object"
                )
              )}
            />
          ),
        }}
      />
    </div>
  );
}

export default DynamicTable;
