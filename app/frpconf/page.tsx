"use client";

import {
  getConfigFromOrigin,
  putConfigToOrigin,
  reloadConfig,
} from "#/lib/server-action";
import { Button, Form, Input, Space, Spin, message } from "antd";
import { useQueryClient, useQuery, useMutation } from "react-query";

const { TextArea } = Input;

export default function Page() {
  const [form] = Form.useForm();
  const handleFileConfSummit = async (data: string) => {
    let res = await putConfigToOrigin(data);

    return Promise.resolve({ res });
  };
  const queryClient = useQueryClient();
  // 查询
  const { data, isFetching } = useQuery({
    queryKey: ["frpconf"],
    queryFn: () => getConfigFromOrigin(),
    async onSuccess(data) {
      form.setFieldValue("frpconf", data);
    },
  });
  // 修改
  const mutation = useMutation({
    mutationFn: (data: string) => handleFileConfSummit(data),
    onSuccess: (data) => {
      message.success(data.res);
      queryClient.invalidateQueries(["frpconf"]);
    },
  });

  return (
    <Form
      style={{ marginLeft: "5rem" }}
      form={form}
      onFinish={(value) => mutation.mutate(value.frpconf)}
    >
      <Form.Item>
        <Space size={"large"}>
          <Button type="primary" htmlType="submit" loading={mutation.isLoading}>
            上传
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              let reloadRes = await reloadConfig();
              message.success(reloadRes);
            }}
          >
            重载
          </Button>
        </Space>
      </Form.Item>

      <Spin tip="Loading" spinning={isFetching}>
        <Form.Item
          name="frpconf"
          // rules={inputRule}
        >
          <TextArea
            showCount
            style={{
              fontSize: 20,
              width: 600,
              height: 700,
              resize: "none",
            }}
          />
        </Form.Item>
      </Spin>
    </Form>
  );
}
