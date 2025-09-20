"use client";
import { ProxyBaseConfig } from "@/types/proxies";
import { Button, Form, Input, Select } from "antd";
import { useEffect } from "react";
import ProxiesFormList from "./proxies-form-list";
import { obj2Arr } from "@/lib";

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
function ProxiesForm({ val }: { val?: ProxyBaseConfig }) {
  console.log("val:", val);
  const [form] = Form.useForm<ProxyBaseConfig>();
  const onFinish = (val: any) => {
    console.log("val:", val);
  };

  useEffect(() => {
    if (!val) return;
    const data = Object.fromEntries(
      Object.entries(val).map(([key, value]) => [
        key,
        typeof value === "object" ? obj2Arr(value) : value,
      ])
    );
    form.setFieldsValue(data);
  }, []);
  return (
    <div>
      <Form name="dynamic_form_nest_item" form={form} onFinish={onFinish}>
        <Form.Item
          label="代理名称 (name)"
          name="name"
          rules={[{ required: true, message: "Please input" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="代理类型 (type)"
          name="type"
          rules={[{ required: true, message: "Please input" }]}
        >
          <Select
            options={ProxiesType.map((value) => ({
              label: value,
              value,
            }))}
          />
        </Form.Item>
        <Form.Item label="远程端口 (remotePort)" name="remotePort">
          <Input />
        </Form.Item>
        <Form.Item label="被代理的本地服务IP (localIP)" name="localIP">
          <Input />
        </Form.Item>
        <Form.Item label="被代理的本地服务端口 (localPort)" name="localPort">
          <Input />
        </Form.Item>
        <ProxiesFormList name="plugin" title="客户端插件配置 (plugin)" />
        <ProxiesFormList name="transport" title="代理网络层配置 (transport)" />
        <ProxiesFormList
          name="healthCheck"
          title="健康检查配置 (healthCheck)"
        />
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

export default ProxiesForm;
