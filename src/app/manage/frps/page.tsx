import React from "react";
import { FrpsTable } from "./frps-table";
import {
  getConf,
  getConfigFromLocal,
  handleSummit,
  reloadConf,
  updateConf,
} from "@/lib/server-action";
import { parse } from "smol-toml";

async function handleSwitchChange(data: any) {
  const res = await updateConf(data);
  if (res) {
    const reloadRes = await reloadConf();
    return reloadRes;
  }
  return res;
}

export default async function Page() {
  // Next 13.4 app router 注意点
  // client组件里不允许使用fetch，除了useSWR或react-query，或者采用服务端组件套客户端组件使用props传值的方式解决
  // server组件只允许fetch等为数不多的函数 如 antd 的message函数这里是不能使用的
  // 使用服务端渲染的数据来渲染的话，一般就需要重新reflesh页面才能获取新数据了（感觉适合那种频繁页面切换来渲染数据）,数据都依赖props决定
  // state 适合做那种传统客户端异步刷新的效果
  const res = await getConf();
  if (!res) {
    return null;
  }
  console.log("res", res);
  return (
    <>
      {/* {console.log(123, "这个输出只能在服务端控制台看到")} */}
      <FrpsTable frpc={[]} frps={[]} handleSwitchChange={handleSwitchChange} />
    </>
  );
}
