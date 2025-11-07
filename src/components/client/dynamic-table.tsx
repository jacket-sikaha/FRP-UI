"use client";

import { ProxyBaseConfig } from "@/types/proxies";
import { proxiesZh } from "@/types/proxies-zh";
import { App, Button, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import FrpcDescriptions from "../server/frpc-descriptions";
import { use, useMemo, useRef, useState } from "react";
import ProxiesForm from "./proxies-form";
import { FrpcConfCtx } from "@/context";
import { FrpcConfig } from "@/types/frpc";
import { updateAndReloadConf } from "@/lib/server-action";
import { stringify } from "smol-toml";
import { produce } from "immer";
import { DrawerContainerProps } from "./drawer-container";

function DynamicTable({ frpcPromise }: { frpcPromise: Promise<FrpcConfig> }) {
  const frpc = use(frpcPromise);
  const { proxies = [] } = frpc;

  const { message, modal } = App.useApp();
  const [tableItem, setTableItem] = useState<ProxyBaseConfig>();
  const drawerRef = useRef(null) as unknown as DrawerContainerProps["ref"];

  const tmp = useMemo(() => Object.assign({}, ...proxies), []);
  const father = Object.entries(tmp).filter(
    ([key, value]) => typeof value !== "object"
  );

  const onDelete = async (id: string) => {
    try {
      const newFrpc = produce(frpc, (draft) => {
        draft.proxies.forEach((item, idx) => {
          if (item.id === id) {
            draft.proxies.splice(idx, 1);
          }
          delete item.id;
        });
      });
      const res = await updateAndReloadConf(stringify(newFrpc));
      if (!res) throw "提交失败";
      message.success("提交成功");
    } catch (error) {
      message.error("提交失败");
    }
  };

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
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                drawerRef.current?.onShow();
                setTableItem(record as ProxyBaseConfig);
              }}
            >
              修改
            </Button>
            <Button
              danger
              onClick={() => {
                modal.confirm({
                  title: "确认删除吗？",
                  okText: "确认",
                  cancelText: "取消",
                  okType: "danger",
                  onOk: () => onDelete(record.id),
                });
              }}
            >
              删除
            </Button>
          </div>
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
        <Button
          className="py-3"
          type="primary"
          onClick={() => {
            drawerRef.current?.onShow();
            setTableItem(undefined);
          }}
        >
          添加代理
        </Button>
        <ProxiesForm ref={drawerRef} value={tableItem} size="default" />
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
