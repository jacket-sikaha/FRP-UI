"use client";
import { ProxyBaseConfig } from "@/types/proxies";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space } from "antd";

function ProxiesFormList({ name = "temp", title = "Proxy" }) {
  return (
    <div>
      <div className="p-2">{title}</div>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, "key"]}
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="key" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "value"]}
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="value" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
}

export default ProxiesFormList;
