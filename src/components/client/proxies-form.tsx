"use client";
import { ProxyBaseConfig } from "@/types/proxies";
import { Button, Form, Input, message, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import ObjInputFormList from "./obj-input-form-list";
import { formList2Obj, obj2FormList } from "@/lib";
import { updateAndReloadConf } from "@/lib/server-action";
import { stringify } from "smol-toml";
import DrawerContainer, {
  DrawerContainerProps,
} from "../server/drawer-container";
import { useFrpcConf } from "@/context";
import { produce } from "immer";

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
function ProxiesForm({
  value,
  show,
  size,
  onClose,
}: { value?: ProxyBaseConfig } & DrawerContainerProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { config, setConfig } = useFrpcConf();
  const [form] = Form.useForm<ProxyBaseConfig>();
  const onFinish = async (val: ProxyBaseConfig) => {
    console.log("value:", value);
    const data = Object.fromEntries(
      Object.entries(val).map(([key, value]) => [
        key,
        typeof value === "object" ? formList2Obj(value) : value,
      ])
    );
    try {
      const newFrpc = produce(config, (draft) => {
        const index = draft.proxies.findIndex((item) => item.id === value?.id);
        console.log(index);
        if (index === -1) return;
        draft.proxies[index] = data as ProxyBaseConfig;
        // draft.proxies = draft.proxies.map((item) =>
        //   item.id === value.id ? value : item
        // );
      });
      console.log("data:", newFrpc);
      await updateAndReloadConf(stringify(newFrpc));
      messageApi.success("提交成功");
    } catch (error) {
      messageApi.error("提交失败");
    }
  };

  useEffect(() => {
    if (!value) return;
    const data = Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key,
        typeof value === "object" ? obj2FormList(value) : value,
      ])
    );
    form.setFieldsValue(data);
  }, [value]);

  return (
    <div>
      {contextHolder}
      <DrawerContainer show={show} onClose={onClose} size={size}>
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
          <ObjInputFormList name="plugin" title="客户端插件配置 (plugin)" />
          <ObjInputFormList
            name="transport"
            title="代理网络层配置 (transport)"
          />
          <ObjInputFormList
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
      </DrawerContainer>
    </div>
  );
}

export default ProxiesForm;
