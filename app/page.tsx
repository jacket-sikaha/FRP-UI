"use client";

import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface DataType {
  key: React.Key;
  token?: string;
  server_addr: string;
  server_port: string;
  admin_addr: string;
  admin_port: string;
  isWork: boolean;
}
const objArray: DataType[] | (() => DataType[]) = [];
for (let i = 0; i < 50; i++) {
  objArray.push({
    key: `React.Key-${i}`,
    token: `token-${i}`,
    server_addr: `server_addr-${i}`,
    server_port: `server_port-${i}`,
    admin_addr: `admin_addr-${i}`,
    admin_port: `admin_port-${i}`,
    isWork: true,
  });
}

export default function Home() {
  const [dataSource, setDataSource] = useState<DataType[]>(objArray);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    // const newData: DataType = {
    //   key: Date.now().toString(),
    //   token: "",
    //   server_addr: "",
    //   server_port: "",
    //   admin_addr: "",
    //   admin_port: "",
    //   isWork: false,
    // };
    // setDataSource([...dataSource, newData]);
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleAddOrEdit = (obj?: DataType) => {
    // form.setFieldsValue({ ...obj });
    // ！！！状态更新时调用setFieldValue需要注意，要等表单组件渲染完成再进行更新表单数据，不然就会被覆盖掉
    //     表单组件未正确地渲染出来。
    // 当表单组件未正确地挂载到 DOM 树上，或者在调用 setFieldsValue() 方法时表单组件还没渲染好 / 已经被卸载时，setFieldsValue() 方法也会失效。你可以使用类似 setTimeout() 的方法在稍后的时间再次调用 setFieldsValue() 方法。
    if (obj) {
      setTimeout(() => {
        form.setFieldsValue({ ...obj });
      }, 1000);
      setIsAdd(false);
    } else {
      setIsAdd(true);
    }
    setIsModalOpen(true);
  };

  const onFinish = (values: any) => {
    console.log("Received values of form:", values);
  };

  const defaultColumns: ColumnsType<DataType> = [
    {
      title: "服务器端IP地址",
      dataIndex: "server_addr",
      width: "30%",
    },
    {
      title: "服务器通信端口",
      dataIndex: "server_port",
    },
    {
      title: "是否启用",
      dataIndex: "isWork",
      render: (_, record: DataType) => {
        return (
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={record.isWork}
            onChange={() => {
              let target =
                dataSource[
                  dataSource.findIndex((item) => item.key == record.key)
                ];
              target.isWork = !record.isWork;
              setDataSource([...dataSource]);
              console.log(dataSource);
            }}
          />
        );
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record: DataType) =>
        dataSource.length >= 1 ? (
          <>
            <Space>
              <Button onClick={() => handleAddOrEdit(record)}>编辑</Button>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(record.key)}
              >
                <Button danger>删除</Button>
              </Popconfirm>
            </Space>
          </>
        ) : null,
    },
  ];

  return (
    <>
      <Button
        onClick={() => handleAddOrEdit()}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        添加配置
      </Button>
      <Table bordered dataSource={dataSource} columns={defaultColumns} />
      <Modal
        title={isAdd ? "添加" : "编辑"}
        destroyOnClose
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={null}
      >
        <Form
          preserve={false}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          form={form}
          style={{ maxWidth: 560 }}
        >
          <Form.Item label="是否启用" name="isWork" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            label="服务器端IP地址"
            name="server_addr"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="服务器通信端口"
            name="server_port"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="原生WEB客户端IP地址"
            name="admin_addr"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="原生WEB客户端端口"
            name="admin_port"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>

          <Form.List name="optional">
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
                      name={[name, "label"]}
                      rules={[{ required: true, message: "补充缺失内容" }]}
                    >
                      <Input placeholder="参数名" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      rules={[{ required: true, message: "补充缺失内容" }]}
                    >
                      <Input placeholder="参数值" />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      rev={undefined}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined rev={undefined} />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "center" }}>
              <Button type="primary" htmlType="submit">
                {isAdd ? "添加" : "修改"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
