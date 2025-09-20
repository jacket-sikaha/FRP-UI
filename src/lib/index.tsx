// 创建 Basic Auth 头部的辅助函数
export const createBasicAuthHeader = (username: string, password: string) => {
  const credentials = `${username}:${password}`;
  const base64Credentials = Buffer.from(credentials).toString("base64");
  return `Basic ${base64Credentials}`;
};

export const obj2Arr = (obj: Record<string, unknown>) => {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
};

export const arr2Obj = (arr: { key: string; value: unknown }[]) => {
  return Object.fromEntries(arr.map((item) => [item.key, item.value]));
};
