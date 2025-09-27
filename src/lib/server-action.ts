"use server";

import { signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { parse } from "smol-toml";

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
    const host = header.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const fullUrl = `${protocol}://${host}/frp-api/reload`;
    const cookieHeader = header.get("cookie") || "";
    const res = await fetch(fullUrl, {
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
export const getConf = async () => {
  try {
    const header = await headers();
    const host = header.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const fullUrl = `${protocol}://${host}/frp-api/config`;
    const cookieHeader = header.get("cookie") || "";
    const res = await fetch(fullUrl, {
      headers: {
        cookie: cookieHeader,
      },
      // next: { revalidate: false },
    });
    const data = await res.json();
    return parse(data);
  } catch (error) {
    return false;
  }
};
export const updateConf = async (val?: string) => {
  if (!val) {
    return false;
  }
  try {
    const header = await headers();
    const host = header.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const fullUrl = `${protocol}://${host}/frp-api/config`;
    const cookieHeader = header.get("cookie") || "";
    const res = await fetch(fullUrl, {
      method: "PUT",
      headers: {
        cookie: cookieHeader,
      },
      body: val,
    });
    const data = await res.json();
    console.log("data", data, res.ok);
    return res.ok;
  } catch (error) {
    return false;
  }
};

export const updateAndReloadConf = async (val?: string) => {
  if (!val) {
    return false;
  }
  try {
    const header = await headers();
    const host = header.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const fullUrl = `${protocol}://${host}/frp-api/config`;
    const cookieHeader = header.get("cookie") || "";
    const res = await fetch(fullUrl, {
      method: "PUT",
      headers: {
        cookie: cookieHeader,
      },
      body: val,
    });
    revalidatePath("/manage/*");
    if (res.ok) {
      console.log("update success");
      const url = `${protocol}://${host}/frp-api/reload`;
      const res = await fetch(url, {
        headers: {
          cookie: cookieHeader,
        },
      });
      const data = await res.json();
      console.log("data", data, res.ok);
      return res.ok;
    }
    return false;
  } catch (error) {
    return false;
  }
};
