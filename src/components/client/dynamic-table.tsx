"use client";

import { ProxyBaseConfig } from "@/types/proxies";
import { proxiesZh } from "@/types/proxies-zh";
import { Button, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import FrpcDescriptions from "../server/frpc-descriptions";
import { useMemo, useRef, useState } from "react";
import ProxiesForm from "./proxies-form";
import { FrpcConfCtx } from "@/context";
import { FrpcConfig } from "@/types/frpc";

function DynamicTable({
  frpc = {
    proxies: [],
  },
}: {
  frpc: FrpcConfig;
}) {
  const { proxies = [] } = frpc;
  const [show, setShow] = useState(false);
  const tableItem = useRef<ProxyBaseConfig>(undefined);
  const tmp = useMemo(() => Object.assign({}, ...proxies), []);
  const father = Object.entries(tmp).filter(
    ([key, value]) => typeof value !== "object"
  );
  const dynamicColumns: ColumnsType = [
    ...father.map(([key, value]) => ({
      title: <Tooltip title={key}>{proxiesZh[key] || key}</Tooltip>,
      dataIndex: key,
      key: key,
      hidden: key === "id",
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
              tableItem.current = record as ProxyBaseConfig;
            }}
          >
            修改
          </a>
        );
      },
    },
  ];

  return (
    <FrpcConfCtx.Provider
      value={{
        config: frpc,
      }}
    >
      <div>
        <Button className="py-3" type="primary" onClick={() => setShow(true)}>
          添加代理
        </Button>
        <ProxiesForm
          show={show}
          value={tableItem.current}
          size="default"
          onClose={() => setShow(false)}
        />
        <Table
          rowKey={"id"}
          columns={dynamicColumns}
          dataSource={proxies}
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
      </div>
    </FrpcConfCtx.Provider>
  );
}

export default DynamicTable;
