"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Switch,
  Table,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { handleSummit } from "@/lib/server-action";
import { validateSpecialCharsOrRepeated } from "@/lib/pauseData";
import { useRouter } from "next/navigation";

type FrpsTableProps = {
  frps: FrpsDataType[];
  frpc: FrpcDataType[];
  handleSwitchChange: Function;
};

export function FrpsTable({ frps, frpc, handleSwitchChange }: FrpsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const storeFrpc = useRef(frpc);
  const inputRule = [
    { required: true, message: "Please input!", whitespace: true },
  ];

  const handleEdit = (obj: FrpsDataType) => {
    // ！！！状态更新时调用setFieldValue需要注意，要等表单组件渲染完成再进行更新表单数据，不然就会被覆盖掉
    //     表单组件未正确地渲染出来。
    // 当表单组件未正确地挂载到 DOM 树上，或者在调用 setFieldsValue() 方法时表单组件还没渲染好 / 已经被卸载时，setFieldsValue() 方法也会失效。你可以使用类似 setTimeout() 的方法在稍后的时间再次调用 setFieldsValue() 方法。
    setTimeout(() => {
      form.setFieldsValue({
        ...obj,
      });
    }, 200);
    setIsModalOpen(true);
  };

  // const age = Form.useWatch("optional", form);
  // console.log("age", age);

  const handleOk = () => {
    setConfirmLoading(true);
    form
      .validateFields()
      .then(async () => {
        // 客户端组件里发送请求的方法 1 ，也可以是自己封装一个server-action导入使用
        let { status } = await handleSummit([
          { ...form.getFieldsValue(), name: "common" },
          ...storeFrpc.current,
        ]);
        form.resetFields();
        setConfirmLoading(false);
        setIsModalOpen(false);
        message.success(status || "success");
        // 手动重新请求获取
        router.refresh();
      })
      .catch((error: any) => {
        setConfirmLoading(false);
        message.error(error.message);
      });
  };

  const defaultColumns: ColumnsType<FrpsDataType> = [
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
      render: (_, record: FrpsDataType) => {
        return (
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            checked={record.isWork}
            onChange={async (value) => {
              // 客户端组件里发送请求的方法 2 还可以是导入父组件配置好的服务端函数使用
              const { status } = await handleSwitchChange([
                { ...frps[0], isWork: value },
                ...storeFrpc.current,
              ]);
              message.success(status);
              router.refresh();
            }}
          />
        );
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record: FrpsDataType) =>
        frps.length >= 1 ? (
          <>
            <Space>
              <Button onClick={() => handleEdit(record)}>编辑</Button>
            </Space>
          </>
        ) : null,
    },
  ];
  return (
    <>
      <Table
        bordered
        dataSource={frps}
        columns={defaultColumns}
        rowKey={"server_addr"}
      />
      <Modal
        title="编辑"
        // forceRender
        // destroyOnClose
        open={isModalOpen}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        okText="修改"
        cancelText="取消"
      >
        <Form
          // preserve={false}
          // modal框里使用表单且需要传入props来显示的情况一定不要写false
          // modal每次关闭都会销毁，打开再重新渲染form
          // 对于Form.List这个神奇组件，设置 preserve={false}他会多渲染一次，把你第一次赋的值重置掉 ？？？
          form={form}
          style={{ maxWidth: 560 }}
        >
          <Form.Item label="是否启用" name="isWork" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            label="服务器端IP地址"
            name="server_addr"
            rules={inputRule}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="服务器通信端口"
            name="server_port"
            rules={inputRule}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="原生WEB客户端IP地址"
            name="admin_addr"
            rules={inputRule}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="原生WEB客户端端口"
            name="admin_port"
            rules={inputRule}
          >
            <Input />
          </Form.Item>

          <Form.List name="optional">
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        // 对应Field name大致为 ['optional', 3, 'label']
                        // 因此 获取Form.List某个具体field值可以这么拿  getFieldValue(["optional", 0, "label"])
                        name={[name, "label"]}
                        rules={[
                          {
                            required: true,
                            message: "补充缺失内容",
                            whitespace: true,
                          },
                          ({ getFieldValue }) => ({
                            async validator(_, value, callback) {
                              if (!value || !value.trim())
                                return Promise.resolve();
                              const labelList = getFieldValue("optional").map(
                                (obj: { label: string; value: string }) =>
                                  obj.label
                              );
                              const { size } = new Set(labelList);
                              if (
                                validateSpecialCharsOrRepeated(
                                  labelList.length,
                                  size
                                )
                              )
                                return Promise.reject(
                                  new Error("非必填区域不允许有重复的字段名称")
                                );

                              if (validateSpecialCharsOrRepeated(value))
                                return Promise.reject(
                                  new Error("不能含有特殊字符或中文")
                                );
                            },
                          }),
                        ]}
                      >
                        <Input placeholder="参数名" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        rules={[
                          {
                            required: true,
                            message: "补充缺失内容",
                            whitespace: true,
                          },
                        ]}
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
              );
            }}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
}
