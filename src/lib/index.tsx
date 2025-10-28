// 创建 Basic Auth 头部的辅助函数
export const createBasicAuthHeader = (username: string, password: string) => {
  const credentials = `${username}:${password}`;
  const base64Credentials = Buffer.from(credentials).toString("base64");
  return `Basic ${base64Credentials}`;
};

export const getServerBasicUrl = (headers: Headers) => {
  const host = headers.get("host");
  const protocol = headers.get("x-forwarded-proto") || "http";
  if (!host && !process.env.NEXT_PUBLIC_APP_HOST) {
    console.error("请求头中未找到 host 信息，且未配置 NEXT_PUBLIC_APP_HOST");
    throw new Error("请求头中未找到 host 信息，且未配置 NEXT_PUBLIC_APP_HOST");
  }
  return `${protocol}://${host}` || process.env.NEXT_PUBLIC_APP_HOST;
};

export const obj2FormList = (obj: Record<string, unknown>) => {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
};

export const formList2Obj = (arr: { key: string; value: unknown }[]) => {
  if (!arr || arr.length === 0) return undefined;
  return Object.fromEntries(arr.map((item) => [item.key, item.value]));
};

export const arr2FormList = (arr: string[]) => {
  return arr.map((item) => ({ value: item }));
};

export const formList2Arr = (arr: { value: string }[]) => {
  if (!arr || arr.length === 0) return undefined;
  return arr.map((item) => item.value);
};

export const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};
