"use client";

import React, { use, useEffect, useRef, useState } from "react";
import {
  AutoComplete,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  MapToObj,
  patternTwo,
  validateSpecialCharsOrRepeated,
} from "#/lib/pauseData";
import { handleSummit, readOptJSON, updateOptJSON } from "#/lib/server-action";

export default function Page() {
  const [dataSource, setDataSource] = useState<FrpcDataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [form] = Form.useForm();
  const editKEY = useRef<React.Key>();
  const storeFrpConf = useRef<confDataType>({ frpc: [], frps: [] });
  const nameMap = useRef<Map<string, FrpcDataType>>();
  const autoCompleteMap = useRef<Map<string, string[]>>();

  const queryClient = useQueryClient();
  // 查询
  const { data, isFetching } = useQuery({
    queryKey: ["frpc"],
    queryFn: () => fetch("http://localhost:3000/api/frp"),
    async onSuccess(data) {
      const { result }: { result: confDataType } = await data.json();
      storeFrpConf.current = result;
      nameMap.current = new Map(result.frpc.map((obj) => [obj.name, obj]));
      setDataSource(result.frpc);
    },
  });
  // 修改
  const mutation = useMutation({
    mutationFn: (data: unknown) => handleSummit(data),
    onSuccess: (data) => {
      setIsAdd(false);
      // 错误处理和刷新
      queryClient.invalidateQueries(["frpc"]);
      queryClient.invalidateQueries(["OPT"]);
      message.success(data.status);
    },
    onError(error: any) {
      message.error(error.status);
    },
  });
  const autoCompleteList = useQuery({
    queryKey: ["OPT"],
    queryFn: () => readOptJSON(),
    onSuccess(data) {
      autoCompleteMap.current = new Map(Object.entries(data));
    },
  });

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    let delObj: FrpcDataType = dataSource.find((item) => item.key == key)!;
    handleOptUpdate(delObj, true);
    mutation.mutate([...storeFrpConf.current?.frps, ...newData]);
  };

  const validateName = async (
    _: any,
    value: string,
    callback: (error?: string | undefined) => void
  ) => {
    try {
      if (!value || !value.trim()) return Promise.resolve();
      if (patternTwo.test(value))
        return Promise.reject(new Error("不允许含有中文"));
      if (isAdd && nameMap.current?.has(value))
        return Promise.reject(new Error("不允许有重复的配置名称"));
      if (
        !isAdd &&
        nameMap.current?.has(value) &&
        nameMap.current?.get(value)?.key !== editKEY.current
      )
        return Promise.reject(new Error("不允许有重复的配置名称"));
    } catch (error: any) {
      callback(error);
    }
  };

  const handleSelectChange = (value: string, record: FrpcDataType) => {
    let index = dataSource.findIndex((item) => item.key == record.key);
    let target = dataSource[index];
    let { remote_port, vhost_http_port, vhost_https_port, ...temp } = {
      ...target,
    };
    temp.type = value;
    switch (value) {
      case "http":
        temp.vhost_http_port = typeToShowValue(target);
        break;
      case "https":
        temp.vhost_https_port = typeToShowValue(target);
        break;
      default:
        temp.remote_port = typeToShowValue(target);
        break;
    }
    dataSource[index] = temp;
    mutation.mutate([...storeFrpConf.current?.frps, ...dataSource]);
  };

  const typeToShowValue = (record: FrpcDataType): string => {
    const { type, vhost_http_port, vhost_https_port, remote_port } = record;
    //  处理可能为空的值带来的类型错误提示-----3种解决办法
    switch (type) {
      case "http":
        return vhost_http_port || "";
      case "https":
        if (typeof vhost_https_port === "string") {
          return vhost_https_port;
        }
      default:
        return remote_port!; // 使用非空断言操作符 说明该变量一定不为空 null
    }
  };

  const handleAddOrEdit = (obj?: FrpcDataType) => {
    // form.setFieldsValue({ ...obj });
    // ！！！状态更新时调用setFieldValue需要注意，要等表单组件渲染完成再进行更新表单数据，不然就会被覆盖掉
    //     表单组件未正确地渲染出来。
    // 当表单组件未正确地挂载到 DOM 树上，或者在调用 setFieldsValue() 方法时表单组件还没渲染好 / 已经被卸载时，setFieldsValue() 方法也会失效。你可以使用类似 setTimeout() 的方法在稍后的时间再次调用 setFieldsValue() 方法。
    if (obj) {
      setTimeout(() => {
        form.setFieldsValue({
          ...obj,
          remote_port: typeToShowValue(obj),
        });
      }, 300);
      editKEY.current = obj?.key;
      setIsAdd(false);
    } else {
      setIsAdd(true);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOptUpdate = async (value: FrpcDataType, isDel?: boolean) => {
    let checkMap = autoCompleteMap.current!;
    let oldObj = dataSource.find((obj) => obj.key === editKEY.current);
    console.log("oldObj", oldObj);
    let oldObjOptionLabel = new Set(
      oldObj?.optional?.map(({ label }) => label)
    );
    // 只搜寻这次编辑有的option
    value.optional?.forEach(({ label }) => {
      // 留下被删除的老选项
      oldObjOptionLabel.delete(label);
      if (!checkMap?.has(label)) return;
      if (isAdd) {
        checkMap.set(label, [...checkMap.get(label)!, value.name]);
        console.log("checkMap", checkMap);
        return;
      }
      let nameSet = new Set(checkMap.get(label));
      if (isDel) {
        nameSet.delete(value.name ?? "");
        checkMap.set(label, [...nameSet]);
        return;
      }
      // 编辑状态对新字段进行更新删除---名字不变set自带去重直接添加，如果换成了新名字应该要删去旧名字
      nameSet.add(value.name);
      oldObj?.name !== value.name && nameSet.delete(oldObj?.name ?? "");
      checkMap.set(label, [...nameSet]);
    });
    // 编辑删除掉选项会出现问题---需要找到编辑前被删除的选项
    // 因为是按照新value去匹配
    // 删掉的option就仍会保留在map里，导致 set 集合不能按要求删除
    console.log("oldObjOptionLabel", oldObjOptionLabel);
    !isAdd &&
      !isDel &&
      oldObjOptionLabel.forEach((key) => {
        if (checkMap.has(key)) {
          let nameSet = new Set(checkMap.get(key));
          nameSet.delete(oldObj?.name ?? "");
          checkMap.set(key, [...nameSet]);
        }
      });
    await updateOptJSON(MapToObj(checkMap));
  };

  const onFinish = (values: FrpcDataType) => {
    console.log("values", values);
    switch (values.type) {
      case "http":
        values.vhost_http_port = values.remote_port;
        values.remote_port = undefined;
        break;
      case "https":
        values.vhost_https_port = values.remote_port;
        values.remote_port = undefined;
        break;
      default:
        break;
    }
    let newData: FrpcDataType[] = JSON.parse(JSON.stringify(dataSource));
    if (!isAdd) {
      newData[newData.findIndex((obj) => obj.key === editKEY.current)] = values;
    } else {
      newData.push(values);
    }
    handleOptUpdate(values);

    mutation.mutate([...storeFrpConf.current?.frps, ...newData]);
    setIsModalOpen(false);
  };

  const defaultColumns: ColumnsType<FrpcDataType> = [
    {
      title: "配置名称",
      dataIndex: "name",
    },
    {
      title: "内网主机IP",
      dataIndex: "local_ip",
    },
    {
      title: "内网主机端口",
      dataIndex: "local_port",
    },
    {
      title: "远端端口",
      dataIndex: "remote_port",
      render: (value, record, index) => typeToShowValue(record),
    },
    {
      title: "协议类型",
      dataIndex: "type",
      render: (_, record: FrpcDataType) => {
        return (
          <Select
            options={["tcp", "udp", "http", "https"].map((value) => ({
              label: value,
              value,
            }))}
            defaultValue={_}
            onChange={(value) => handleSelectChange(value, record)}
          />
        );
      },
    },
    {
      title: "是否启用",
      dataIndex: "isWork",
      render: (_, record: FrpcDataType) => {
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
              mutation.mutate([...storeFrpConf.current?.frps, ...dataSource]);
            }}
          />
        );
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record: FrpcDataType, index) =>
        dataSource.length >= 1 ? (
          <>
            <Space>
              <Button onClick={() => handleAddOrEdit(record)}>编辑</Button>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(record.key)}
                onCancel={() => {
                  setIsAdd(false);
                }}
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
      <Table
        bordered
        dataSource={dataSource}
        columns={defaultColumns}
        scroll={{ y: 650 }}
        loading={isFetching}
      />
      <Modal
        title={isAdd ? "添加" : "编辑"}
        // destroyOnClose
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={null}
        confirmLoading={mutation.isLoading}
      >
        <Form
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          form={form}
          style={{ maxWidth: 560 }}
          initialValues={{ isWork: true }}
        >
          <Form.Item label="是否启用" name="isWork" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            label="配置名称"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input!",
                whitespace: true,
              },
              {
                validator: validateName,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="协议类型"
            name="type"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Select
              options={["tcp", "udp", "http", "https"].map((value) => ({
                label: value,
                value,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="内网主机IP"
            name="local_ip"
            rules={[
              { required: true, message: "Please input!", whitespace: true },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="内网主机端口"
            name="local_port"
            rules={[
              { required: true, message: "Please input!", whitespace: true },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="远端端口"
            name={"remote_port"}
            rules={[
              { required: true, message: "Please input!", whitespace: true },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.List name="optional">
            {(fields, { add, remove }, { errors }) => (
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
                      <AutoComplete
                        style={{ width: 200 }}
                        options={[
                          ...(autoCompleteMap.current?.keys() ?? []),
                        ].map((str) => ({
                          value: str,
                        }))}
                        placeholder="参数名"
                      />
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
