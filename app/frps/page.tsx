// "use client";

import React from "react";
import { FrpsTable } from "./frps-table";

export default async function Page() {
  const { result } = await (
    await fetch("http://localhost:3000/api/frp")
  ).json();
  // client组件里不允许使用fetch，除了useSWR或react-query，或者采用服务端组件套客户端组件和props传值的方式解决
  // server组件只允许fetch等为数不多的函数 如 antd 的message函数这里是不能使用的

  return (
    <>
      {console.log("server updated")}
      <FrpsTable result={result ?? []} />
    </>
  );
}
