"use client";

import { ProxyBaseConfig } from "@/types/proxies";
import { proxiesZh } from "@/types/proxies-zh";
import { Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import FrpcDescriptions from "../server/frpc-descriptions";
import { useMemo, useState } from "react";
import ProxiesForm from "./proxies-form";
import DrawerContainer from "../server/drawer-container";

function DynamicTable({ obj = [] }: { obj: Record<string, unknown>[] }) {
  const [show, setShow] = useState(false);
  const [val, setVal] = useState<ProxyBaseConfig>();

  const tmp = useMemo(() => Object.assign({}, ...obj), []);
  const father = Object.entries(tmp).filter(
    ([key, value]) => typeof value !== "object"
  );
  const dynamicColumns: ColumnsType = [
    ...father.map(([key, value]) => ({
      title: <Tooltip title={key}>{proxiesZh[key] || key}</Tooltip>,
      dataIndex: key,
      key: key,
      render: (text: string) => (
        <div className="text-center">{text ?? "--"}</div>
      ),
    })),
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              setShow(true);
              setVal(record as ProxyBaseConfig);
            }}
          >
            修改
          </a>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        rowKey={"id"}
        columns={dynamicColumns}
        dataSource={obj}
        expandable={{
          rowExpandable: (record) =>
            Object.entries(record).some(
              ([key, value]) => typeof value === "object"
            ),
          expandedRowRender: (record, idx) => (
            <FrpcDescriptions
              key={idx}
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
      <DrawerContainer show={show} onClose={() => setShow(false)}>
        <ProxiesForm value={val} />
      </DrawerContainer>
    </div>
  );
}

export default DynamicTable;
