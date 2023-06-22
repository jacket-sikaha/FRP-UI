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
export const patternThree = /[a-zA-Z]+/gm;

export function pauseToJSON(params: string) {
  let index = -1;
  let nameArr: any[] = [];
  params.split(/[\r\n]+/gm).forEach((str) => {
    if (!str) return;
    if (str.indexOf("=") !== -1) {
      // 先看看键名是不是带注释的选项
      // 启用状态下 至少有一个# 才是 注释状态
      // 非启用状态下 至少两个# 才是
      let labelIsWork =
        (str.slice(0, str.indexOf("=")).match(/#/g) ?? []).length >
        (nameArr[index].isWork ? 0 : 1);
      str = str.replace(/\#/gm, "");
      let label = str.slice(0, str.indexOf("=")).trim();
      let value = str.slice(str.indexOf("=") + 1).trim();
      if (necessaryArrays.includes(label)) {
        nameArr[index][label] = value;
        return;
      }
      nameArr[index].optional.push({ label, value, labelIsWork: !labelIsWork });
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
    obj?.optional?.forEach(({ label, value, labelIsWork }) => {
      // 不启用的注释状态 + 原有就有选项注释 则是是## ，正常选项则按照必选选项根据是否启用的字段来控制
      optionalStr += `${labelIsWork ? "" : "#"}${
        obj.isWork ? "" : "# "
      }${label} = ${value}\r\n`;
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

export function frpPauseToNewOptionMap(
  params: string,
  optKey: string[]
): Map<string, string[]> {
  let index = "";
  // 文件编辑删掉的选项不能连选项实体也被删去了
  let newMap = new Map<string, string[]>(optKey.map((key) => [key, []]));
  params.split(/[\r\n]+/gm).forEach((str) => {
    if (!str) return;
    if (str.indexOf("=") !== -1) {
      str = str.replace(/\#/gm, "");
      let label = str.slice(0, str.indexOf("=")).trim();
      if (necessaryArrays.includes(label)) return;
      if (optKey.includes(label)) {
        // 文件编辑可以手动添加重复的自选项，因此去重避免影响其他地方逻辑
        newMap.set(label, [...new Set([...(newMap.get(label) ?? []), index])]);
      }
    } else {
      let name = str.slice(str.search(/\[.+\]$/gm) + 1, -1).trim();
      index = name;
    }
  });
  return newMap;
}

export const MapToObj = (map: Map<string, string[]>) => {
  let opj: { [key: string]: any } = {};
  map.forEach((val, key) => {
    opj[key] = val;
  });
  return opj;
};

export const validateSpecialCharsOrRepeated = (
  value: string | number,
  length?: number
) => {
  if (typeof value === "string")
    return patternOne.test(value) || patternTwo.test(value);

  return value !== length;
};
