"use client";
import { useRef } from "react";
import CodeMirrorEditor, { EditorRefType } from "./editor-view";
import { Button, message } from "antd";

function FrpEditor({
  value = "",
  height = "300",
  updateConf = async (val?: string) => false,
  reloadConf = async () => false,
}) {
  const editorRef = useRef<EditorRefType>(null);
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div>
      {contextHolder}
      <div className="flex items-center gap-5 p-3">
        <Button
          onClick={async () => {
            const conf = editorRef.current?.getValue();
            console.log(conf);
            const res = await updateConf(conf);
            if (res) {
              messageApi.success("配置更新成功");
            } else {
              messageApi.error("配置更新失败");
            }
          }}
        >
          更新配置
        </Button>
        <Button
          onClick={async () => {
            const res = await reloadConf();
            if (res) {
              messageApi.success("配置重载成功");
            } else {
              messageApi.error("配置重载失败");
            }
          }}
        >
          重载配置
        </Button>
      </div>
      <CodeMirrorEditor value={value} height={height} ref={editorRef} />
    </div>
  );
}
export default FrpEditor;
