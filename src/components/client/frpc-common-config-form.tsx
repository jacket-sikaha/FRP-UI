"use client";
import { FrpcConfCtx } from "@/context";
import { arr2FormList, formList2Arr, formList2Obj, obj2FormList } from "@/lib";
import { updateAndReloadConf } from "@/lib/server-action";
import { App, Button, Form, Input, message } from "antd";
import { produce } from "immer";
import { useContext, useEffect } from "react";
import { stringify } from "smol-toml";
import ObjInputFormList from "./obj-input-form-list";

function FrpcCommonConfigForm() {
  const { message } = App.useApp();
  const { config } = useContext(FrpcConfCtx);
  const { proxies, ...clientConfig } = config;

  const [form] = Form.useForm<Record<string, unknown>>();
  const onFinish = async (val: Record<string, unknown>) => {
    const data = Object.fromEntries(
      Object.entries(val).map(([key, value]) => [
        key,
        typeof value === "object"
          ? ["includes", "start"].includes(key)
            ? formList2Arr(value as { value: string }[])
            : formList2Obj(value as { key: string; value: unknown }[])
          : !!value
          ? value
          : undefined,
      ])
    );
    try {
      const newFrpc = produce(config, (draft) => {
        Object.assign(draft, data);
      });

      const res = await updateAndReloadConf(stringify(newFrpc));
      if (!res) throw "提交失败";
      message.success("提交成功");
    } catch (error) {
      message.error("提交失败");
    }
  };

  useEffect(() => {
    console.log("FrpcCommonConfigForm  sssssssss");
    const data = Object.fromEntries(
      Object.entries(clientConfig).map(([key, value]) => [
        key,
        typeof value === "object"
          ? Array.isArray(value)
            ? arr2FormList(value)
            : obj2FormList(value as Record<string, unknown>)
          : value ?? "--",
      ])
    );
    form.setFieldsValue(data);
    return () => {
      console.log("FrpcCommonConfigForm end");
    };
  }, [config]);

  return (
    <div>
      <Form
        name="frpcCommonConfig"
        clearOnDestroy
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="用户名 (user)" name="user">
          <Input />
        </Form.Item>
        <Form.Item
          label="连接服务端的地址 (serverAddr)"
          name="serverAddr"
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="连接服务端的端口 (serverPort)"
          name="serverPort"
          required
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="xtcp 打洞所需的 stun 服务器地址 (natHoleStunServer)"
          name="natHoleStunServer"
        >
          <Input />
        </Form.Item>
        <Form.Item label="DNS 服务器地址 (dnsServer)" name="dnsServer">
          <Input />
        </Form.Item>
        <Form.Item
          label="第一次登陆失败后是否退出 (loginFailExit)"
          name="loginFailExit"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="代理 UDP 服务时支持的最大包长度，默认为 1500 (udpPacketSize)"
          name="udpPacketSize"
        >
          <Input />
        </Form.Item>
        <ObjInputFormList name="auth" title="客户端鉴权配置 (auth)" />
        <ObjInputFormList
          name="webServer"
          title="客户端 AdminServer 配置 (webServer)"
        />
        <ObjInputFormList
          name="start"
          title="指定启用部分代理，默认为全部启用 (start)"
          isArray
        />
        <ObjInputFormList
          name="includes"
          title="指定额外的配置文件目录 (includes)"
          isArray
        />
        <ObjInputFormList
          name="transport"
          title="客户端网络层配置 (transport)"
        />
        <ObjInputFormList name="log" title="日志配置 (log)" />
        <ObjInputFormList name="virtualNet" title="虚拟网络配置 (virtualNet)" />
        <Form.Item>
          <div className="flex justify-around w-full">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button
              type="dashed"
              onClick={() => {
                form.resetFields();
              }}
            >
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default FrpcCommonConfigForm;
