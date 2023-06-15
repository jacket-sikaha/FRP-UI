import { randomUUID } from "crypto";

const necessaryArrays = [
  "server_addr",
  "server_port",
  "admin_addr",
  "admin_port",
  "token",
  // frpc
  "type",
  "local_ip",
  "local_port",
  "remote_port",
  "name",
  "vhost_http_port",
  "vhost_https_port",
];

export const patternOne = /[`~!@#$%^&*()+={}[\]\\|:;'",<>/?]/g;
export const patternTwo = /[\u4e00-\u9fa5]/g;

export function pauseToJSON(params: string) {
  let index = -1;
  let nameArr: any[] = [];
  params.split(/[\r\n]+/gm).forEach((str) => {
    if (!str) return;
    if (str.indexOf("=") !== -1) {
      str = str.replace(/\#/gm, "");
      let label = str.slice(0, str.indexOf("=")).trim();
      let value = str.slice(str.indexOf("=") + 1).trim();
      if (necessaryArrays.includes(label)) {
        nameArr[index][label] = value;
        return;
      }
      nameArr[index].optional.push({ label, value });
    } else {
      let name = str.slice(str.search(/\[.+\]$/gm) + 1, -1).trim();
      index++;
      nameArr.push({
        name,
        optional: [],
        isWork: str.indexOf("#") < 0,
        key: randomUUID(),
      });
    }
  });
  return nameArr;
}

export function JsonToFrps(params: FrpsDataType[]): string {
  let res: string[] = [];
  params.forEach((obj, index) => {
    let necessaryStr = `${obj.isWork ? "" : "# "}[${obj.name}]\r\n`;
    Object.entries(obj).forEach((item) => {
      const [key, value] = item;
      if (["isWork", "name", "optional", "key"].includes(key)) {
        return;
      }
      necessaryStr += `${obj.isWork ? "" : "# "}${key} = ${value}\r\n`;
    });
    res[index] = necessaryStr;
  });

  params.forEach((obj, index) => {
    let optionalStr = "";
    obj?.optional?.forEach(({ label, value }) => {
      optionalStr += `${obj.isWork ? "" : "# "}${label} = ${value}\r\n`;
    });
    res[index] += optionalStr;
    // delete obj.optional;
    // return obj;
    // 删除 obj 某个属性的第二种方法
    // const { optional, ...rest } = obj;
    // return rest;
  });
  return res.join("");
}

export const validateSpecialCharsOrRepeated = (
  value: string | number,
  length?: number
) => {
  if (typeof value === "string")
    return patternOne.test(value) || patternTwo.test(value);

  return value !== length;
};
