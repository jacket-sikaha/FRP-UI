"use client";

import {
  getConfigFromOrigin,
  putConfigToOrigin,
  reloadConfig,
} from "#/lib/server-action";
import { Button, Form, Input, Spin, message } from "antd";
import { useQueryClient, useQuery, useMutation } from "react-query";

const { TextArea } = Input;

const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  console.log("Change:", e.target.value);
};
export default function Page() {
  const [form] = Form.useForm();
  const handleFileConfSummit = async (data: string) => {
    let res = await putConfigToOrigin(data);
    let reloadRes = await reloadConfig();
    return Promise.resolve({ res, reloadRes });
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
      message.success(data.reloadRes);
      queryClient.invalidateQueries(["frpconf"]);
    },
  });

  return (
    <Form
      style={{ marginLeft: "5rem" }}
      form={form}
      onFinish={(value) => mutation.mutate(value.frpconf)}
    >
      <Spin tip="Loading" spinning={isFetching}>
        <Form.Item
          name="frpconf"
          // rules={inputRule}
        >
          <TextArea
            showCount
            style={{
              width: 500,
              height: 750,
              resize: "none",
            }}
            onChange={onChange}
          />
        </Form.Item>
      </Spin>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: ".3rem 20rem 0" }}
          loading={mutation.isLoading}
        >
          提交
        </Button>
      </Form.Item>
    </Form>
  );
}
