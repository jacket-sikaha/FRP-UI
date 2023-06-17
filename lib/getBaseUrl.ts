import { cache } from "react";
import path from "path";
import { writeFileSync, readFileSync } from "fs";

export const optJSONPath = path.join(process.cwd(), "lib", "optMap.json");
export const getBaseUrl = cache(() =>
  process.env.VERCEL_URL
    ? `https://app-dir.vercel.app`
    : `http://localhost:${process.env.PORT ?? 3000}`
);

// FILE
// 没有文件也会自动创建
export const updateFile = (path: string, newData: string) => {
  writeFileSync(path, newData);
};

export const readJSONFile = (path: string) => {
  // 读取文件并解析成对象
  const data = readFileSync(path, "utf8");
  return JSON.parse(data);
};
