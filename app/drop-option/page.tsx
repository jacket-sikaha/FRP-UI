"use client";
import { optJSONPath } from "#/lib/getBaseUrl";
import { MapToObj } from "#/lib/pauseData";
import {
  getConfigFromOrigin,
  readOptJSON,
  updateOptJSON,
} from "#/lib/server-action";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Collapse,
  Form,
  Input,
  Modal,
  Popconfirm,
  Typography,
  Space,
  Spin,
  Statistic,
  message,
  Tag,
} from "antd";
import form from "antd/es/form";
import { HtmlHTMLAttributes, ReactElement, useEffect, useState } from "react";
import { useQueryClient, useQuery, useMutation } from "react-query";
const { Panel } = Collapse;

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: string) => void;
  onCancel: () => void;
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [option, setOption] = useState(new Map<string, string[]>());

  const queryClient = useQueryClient();
  // 查询
  const { data, isFetching } = useQuery({
    queryKey: ["OPT"],
    queryFn: () => readOptJSON(),
    onSuccess(data) {
      console.log("data", data);
      setOption(new Map(Object.entries(data)));
    },
  });
  // 修改
  const mutation = useMutation({
    mutationFn: (data: unknown) => updateOptJSON(data),
    onSuccess: (data) => {
      message.success(data.res);
      queryClient.invalidateQueries(["OPT"]);
    },
  });

  const onCreate = (values: any) => {
    option.set(values.optName, []);
    mutation.mutate(MapToObj(option));
    setOpen(false);
  };

  const handleDelete = (key: string) => {
    option.delete(key);
    return mutation.mutate(MapToObj(option));
  };

  const genExtra = (key: string) => (
    <Popconfirm
      placement="topLeft"
      title="确定删除?"
      onConfirm={() => handleDelete(key)}
    >
      <DeleteOutlined
        style={{ fontSize: "20px", display: "flex", alignItems: "center" }}
        rev={undefined}
      />
    </Popconfirm>
  );

  const validateName = async (
    _: any,
    value: string,
    callback: (error?: string | undefined) => void
  ) => {
    try {
      if (!value || !value.trim()) return Promise.resolve();
      if (option?.has(value.trim()))
        return Promise.reject(new Error("不允许有重复的配置名称"));
    } catch (error: any) {
      callback(error);
    }
  };

  const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
    open,
    onCreate,
    onCancel,
  }) => {
    const [form] = Form.useForm();
    return (
      <Modal
        open={open}
        title="添加自定义选项"
        okText="创建"
        cancelText="取消"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form form={form} name="form_in_modal">
          <Form.Item
            name="optName"
            label="选项名"
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
        </Form>
      </Modal>
    );
  };
  return (
    <>
      <Button
        type="primary"
        style={{ margin: "1rem" }}
        onClick={() => {
          setOpen(true);
        }}
      >
        添加自定义选项
      </Button>
      <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <div
        style={{
          margin: ".6rem auto",
          maxWidth: "90%",
          maxHeight: "85%",
          overflow: "auto",
        }}
      >
        <Spin tip="Loading" spinning={isFetching}>
          <Collapse collapsible="header" defaultActiveKey={["1"]}>
            {[...option.keys()].map((name) => (
              <Panel
                header={
                  <Space wrap>
                    <h3
                      style={{
                        wordWrap: "break-word" /* 强制自动换行 */,
                        // maxWidth: "1rem" /* 自适应父容器宽度 */,
                      }}
                    >
                      {name}
                    </h3>
                    <div>
                      <Tag color="#2db7f5">使用人数：</Tag>
                      {option.get(name)?.length}
                    </div>
                  </Space>
                }
                showArrow={false}
                key={name}
                extra={genExtra(name)}
              >
                <Space wrap size={10}>
                  {option.get(name)?.map((item) => (
                    <Tag key={name + item}>{item}</Tag>
                  ))}
                </Space>
              </Panel>
            ))}
          </Collapse>
        </Spin>
      </div>
    </>
  );
}
