// 创建 Basic Auth 头部的辅助函数
export const createBasicAuthHeader = (username: string, password: string) => {
  const credentials = `${username}:${password}`;
  const base64Credentials = Buffer.from(credentials).toString("base64");
  return `Basic ${base64Credentials}`;
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
