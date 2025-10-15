"use server";

import { signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { parse } from "smol-toml";
import clientFetch from "./request";
import { getServerBasicUrl } from ".";

// 对于提交请求这种自定义的请求函数需要在client组件里使用，需要使用server action这种配置写法

export const handleSummit = async (data: unknown) => {
  const res = await fetch(`/api/putConf`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const getStatusFromOrigin = async (): Promise<StatusDataType> => {
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  return await res.json();
};

export const getConfigFromLocal = async () => {
  const res = await fetch(`/api/frp`, {
    cache: "no-store",
  });
  return await res.json();
};

export const getConfigFromOrigin = async (): Promise<string> => {
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/config`, {
    cache: "no-store",
  });
  return await res.text();
};

export const putConfigToOrigin = async (data: string) => {
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/config`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/xml",
    },
    body: data,
  });
  return await res.text();
};

export const reloadConfig = async () => {
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/reload`, {
    headers: {},
  });
  return await res.text();
};

// JSON
export const readOptJSON = async (): Promise<Map<string, string[]>> => {
  const res = await fetch(`/api/optAction`, {
    cache: "no-store",
  });
  return await res.json();
};

export const updateOptJSON = async (data: unknown) => {
  const res = await fetch(`/api/optAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return await res.json();
};

export const signOutAction = async () => signOut();

export const reloadConf = async () => {
  try {
    const header = await headers();
    // Referer 头的设计初衷是标识 "当前请求是从哪个页面跳转过来的"，而直接输入 URL 或强制刷新属于 "无来源" 的请求，浏览器自然不会发送该头信息
    // if (!referer) {
    //   console.error("缺少 referer 头信息");
    //   return false;
    // }
    // const url = new URL(referer);
    const fullUrl = `${getServerBasicUrl(header)}/frp-api/reload`;
    const cookieHeader = header.get("cookie") || "";
    const res = await clientFetch(fullUrl, {
      headers: {
        cookie: cookieHeader,
      },
    });
    const data = await res.json();
    console.log("data", data, res.ok);
    return res.ok;
  } catch (error) {
    return false;
  }
};
export const getConf = async (needText = false) => {
  try {
    const header = await headers();
    const fullUrl = `${getServerBasicUrl(header)}/frp-api/config`;
    const cookieHeader = header.get("cookie") || "";

    // 明确禁用缓存（强制刷新时重新请求）
    const res = await clientFetch(fullUrl, {
      headers: { cookie: cookieHeader },
      // next: { revalidate: 0 }, // 禁用缓存，每次请求都重新获取
    });

    // 检查响应是否成功
    if (!res.ok) {
      throw new Error(`请求失败: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return needText ? data : parse(data);
  } catch (error) {
    // 放行重定向错误
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("getConf 执行出错:", error);
    // 出错时返回兜底值，避免组件接收 undefined
    return false;
  }
};
export const updateConf = async (val?: string) => {
  if (!val) return false;
  try {
    const header = await headers();
    const fullUrl = `${getServerBasicUrl(header)}/frp-api/config`;
    const cookieHeader = header.get("cookie") || "";
    const res = await clientFetch(fullUrl, {
      method: "PUT",
      headers: {
        cookie: cookieHeader,
      },
      body: val,
    });
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const updateAndReloadConf = async (val?: string) => {
  if (!val) return false;
  try {
    const header = await headers();
    const url = getServerBasicUrl(header);
    const fullUrl = `${url}/frp-api/config`;
    const cookieHeader = header.get("cookie") || "";
    const res = await clientFetch(fullUrl, {
      method: "PUT",
      headers: {
        cookie: cookieHeader,
      },
      body: val,
    });
    revalidatePath("/manage/*");
    if (res.ok) {
      console.log("update success");
      const reloadUrl = `${url}/frp-api/reload`;
      const res = await clientFetch(reloadUrl, {
        headers: {
          cookie: cookieHeader,
        },
      });
      const data = await res.json();
      return res.ok;
    }
    return false;
  } catch (error) {
    return false;
  }
};
