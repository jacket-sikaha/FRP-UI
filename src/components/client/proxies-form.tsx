"use client";
import { useFrpcConf } from "@/context";
import { arr2FormList, formList2Arr, formList2Obj, obj2FormList } from "@/lib";
import { updateAndReloadConf } from "@/lib/server-action";
import { ProxyBaseConfig } from "@/types/proxies";
import { App, Button, Form, Input, InputNumber, Select } from "antd";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { stringify } from "smol-toml";
import DrawerContainer, { DrawerContainerProps } from "./drawer-container";
import ObjInputFormList from "./obj-input-form-list";

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
  size,
  ref,
}: { value?: ProxyBaseConfig } & DrawerContainerProps) {
  const { message, modal } = App.useApp();
  const { config, setConfig } = useFrpcConf();

  const [showRemotePort, setShowRemotePort] = useState(false);
  const [showDomainConfig, setShowDomainConfig] = useState(false);
  const [form] = Form.useForm<Record<string, unknown>>();
  const onFinish = async (val: Record<string, unknown>) => {
    if (!showRemotePort) {
      delete val["remotePort"];
    }
    if (!showDomainConfig) {
      delete val["subdomain"];
      delete val["customDomains"];
    }
    const data = Object.fromEntries(
      Object.entries(val).map(([key, value]) => [
        key,
        typeof value === "object"
          ? ["customDomains"].includes(key)
            ? formList2Arr(value as { value: string }[])
            : formList2Obj(value as { key: string; value: unknown }[])
          : !!value
          ? value
          : undefined,
      ])
    );
    try {
      const newFrpc = produce(config, (draft) => {
        if (!value?.id) {
          draft.proxies.push(data as ProxyBaseConfig);
        } else {
          const idx = draft.proxies.findIndex((item) => item.id === value?.id);
          if (idx === -1) throw "代理不存在";
          draft.proxies[idx] = data as ProxyBaseConfig;
        }
        draft.proxies.forEach((item, idx) => {
          delete item.id;
        });
      });
      const res = await updateAndReloadConf(stringify(newFrpc));
      if (!res) throw "提交失败";
      message.success("提交成功");
    } catch (error) {
      message.error("提交失败");
    } finally {
      ref.current?.onClose();
    }
  };
  const handleTypeChange = (type: string) => {
    setShowRemotePort(["tcp", "udp"].includes(type));
    setShowDomainConfig(["http", "https", "tcpmux"].includes(type));
  };

  useEffect(() => {
    if (!value) return;
    const data = Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        typeof val === "object"
          ? Array.isArray(val)
            ? arr2FormList(val)
            : obj2FormList(val as Record<string, unknown>)
          : val ?? "--",
      ])
    );
    // 延迟设置，确保组件已渲染
    const timer = setTimeout(() => {
      form.setFieldsValue(data);
    }, 0);
    handleTypeChange(data.type);
    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  return (
    <div>
      <DrawerContainer size={size} ref={ref}>
        <Form name="proxies" clearOnDestroy form={form} onFinish={onFinish}>
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
              onChange={(val) => handleTypeChange(val)}
            />
          </Form.Item>
          <Form.Item
            label="远程端口 (remotePort)"
            name="remotePort"
            hidden={!showRemotePort}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="被代理的本地服务IP (localIP)" name="localIP">
            <Input />
          </Form.Item>
          <Form.Item label="被代理的本地服务端口 (localPort)" name="localPort">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="子域名 (subdomain)"
            name="subdomain"
            hidden={!showDomainConfig}
          >
            <Input />
          </Form.Item>

          {showDomainConfig && (
            <ObjInputFormList
              name="customDomains"
              title="自定义域名列表 (customDomains)"
              isArray
            />
          )}
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
