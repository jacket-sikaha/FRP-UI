"use client";

import { MapToObj, frpPauseToNewOptionMap } from "#/lib/pauseData";
import {
  getConfigFromOrigin,
  putConfigToOrigin,
  readOptJSON,
  reloadConfig,
  updateOptJSON,
} from "#/lib/server-action";
import { Button, Form, Input, Space, Spin, message } from "antd";
import { useRef } from "react";
import { useQueryClient, useQuery, useMutation } from "react-query";

const { TextArea } = Input;

export default function Page() {
  const [form] = Form.useForm();
  const checkMap = useRef<Map<string, string[]>>();

  const handleFileConfSummit = async (data: string) => {
    // let res = await putConfigToOrigin(data);
    console.log("res", data);
    let newMap = frpPauseToNewOptionMap(data, [...checkMap.current?.keys()!]);
    await updateOptJSON(MapToObj(newMap));
    return Promise.resolve({ res: 1 });
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
  const autoCompleteList = useQuery({
    queryKey: ["OPT"],
    queryFn: () => readOptJSON(),
    onSuccess(data) {
      checkMap.current = new Map(Object.entries(data));
    },
  });
  // 修改
  const mutation = useMutation({
    mutationFn: (data: string) => handleFileConfSummit(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["frpconf"]);
      queryClient.invalidateQueries(["OPT"]);
      message.success(data.res);
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
        <Form.Item name="frpconf">
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
