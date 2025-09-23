"use client";
import { Button, Form, Input, Select } from "antd";
import { useEffect } from "react";
import ObjInputFormList from "./obj-input-form-list";
import { arr2FormList, obj2FormList } from "@/lib";
import { ClientCommonConfig } from "@/types/frpc";

const ProxiesType = [
  "tcp",
  "udp",
  "http",
  "https",
  "tcpmux",
  "stcp",
  "sudp",
  "xtcp",
];

function FrpcCommonConfigForm({ value }: { value?: ClientCommonConfig }) {
  console.log("value:", value);
  const [form] = Form.useForm<ClientCommonConfig>();
  const onFinish = (value: any) => {
    console.log("value:", value);
  };

  useEffect(() => {
    if (!value) return;
    const data = Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key,
        typeof value === "object"
          ? Array.isArray(value)
            ? arr2FormList(value)
            : obj2FormList(value)
          : value,
      ])
    );
    form.setFieldsValue(data);
  }, []);
  return (
    <div>
      <Form name="dynamic_form_nest_item" form={form} onFinish={onFinish}>
        <Form.Item label="用户名 (user)" name="user">
          <Input />
        </Form.Item>
        <Form.Item label="连接服务端的地址 (serverAddr)" name="serverAddr">
          <Input />
        </Form.Item>
        <Form.Item label="连接服务端的端口 (serverPort)" name="serverPort">
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
