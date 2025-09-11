"use server";

import { signOut } from "@/auth";

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
    method: "GET",
    cache: "no-store",
  });
  return await res.json();
};

export const getConfigFromOrigin = async (): Promise<string> => {
  const res = await fetch(`${process.env.ORIGIN_SERVER}/api/config`, {
    method: "GET",
    headers: {},
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
