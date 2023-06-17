"use server";
// 对于提交请求这种自定义的请求函数需要在client组件里使用，需要使用server action这种配置写法

export const handleSummit = async (data: unknown) => {
  let res = await fetch(`${process.env.LOCAL_SERVER}/api/putConf`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const getStatusFromOrigin = async (): Promise<StatusDataType> => {
  let res = await fetch(`${process.env.ORIGIN_SERVER}/api/status`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
};

export const getConfigFromOrigin = async () => {
  let res = await fetch(`${process.env.ORIGIN_SERVER}/api/config`, {
    method: "GET",
  });
  return await res.text();
};

export const putConfigToOrigin = async (data: string) => {
  let res = await fetch(`${process.env.ORIGIN_SERVER}/api/config`, {
    method: "PUT",
    headers: { "Content-Type": "application/xml" },
    body: data,
  });
  return await res.text();
};

export const reloadConfig = async () => {
  let res = await fetch(`${process.env.ORIGIN_SERVER}/api/reload`);
  return await res.text();
};

// JSON
export const readOptJSON = async (): Promise<Map<string, string[]>> => {
  let res = await fetch(`${process.env.LOCAL_SERVER}/api/optAction`);
  return await res.json();
};

export const updateOptJSON = async (data: unknown) => {
  let res = await fetch(`${process.env.LOCAL_SERVER}/api/optAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};
