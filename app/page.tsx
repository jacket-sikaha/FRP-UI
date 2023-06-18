"use client";

import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import { getStatusFromOrigin } from "#/lib/server-action";
import { useQueryClient, useQuery } from "react-query";

export default function Home() {
  // 查询
  const { data, isFetching } = useQuery({
    queryKey: ["frp-status"],
    queryFn: () => getStatusFromOrigin(),
  });

  const defaultColumns: ColumnsType<StatusTableDataType> = [
    {
      title: "配置名称",
      dataIndex: "name",
      // 都按照字符串的 Unicode 编码顺序 进行比较
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "协议类型",
      dataIndex: "type",
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: "本地地址",
      dataIndex: "local_addr",
      sorter: (a, b) => a.local_addr.localeCompare(b.local_addr),
    },
    // {
    //   title: "plugin",
    //   dataIndex: "plugin",
    //   sorter: (a, b) => a.plugin.localeCompare(b.plugin),
    // },
    {
      title: "远程地址",
      dataIndex: "remote_addr",
      sorter: (a, b) => a.remote_addr.localeCompare(b.remote_addr),
    },
    {
      title: "状态",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "信息",
      dataIndex: "err",
    },
  ];
  return (
    <>
      <Table
        bordered
        loading={isFetching}
        scroll={{ y: 650 }}
        dataSource={Object.values(data || [])
          .flatMap((obj) => obj)
          .map((obj, index) => {
            obj.key = index;
            return obj;
          })}
        columns={defaultColumns}
      />
    </>
  );
}
