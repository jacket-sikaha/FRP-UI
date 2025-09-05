// 创建 Basic Auth 头部的辅助函数
export const createBasicAuthHeader = (username: string, password: string) => {
  const credentials = `${username}:${password}`;
  const base64Credentials = Buffer.from(credentials).toString("base64");
  return `Basic ${base64Credentials}`;
};
