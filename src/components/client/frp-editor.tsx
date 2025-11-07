"use client";
import { use, useRef, useState } from "react";
import CodeMirrorEditor, { EditorRefType } from "./editor-view";
import { App, Button, message, Spin } from "antd";
import { reloadConf, updateConf } from "@/lib/server-action";

function FrpEditor({
  frpcPromise,
  height = "300",
}: {
  frpcPromise: Promise<string>;
  height?: string;
}) {
  const value = use(frpcPromise);
  const editorRef = useRef<EditorRefType>(null);
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Spin spinning={loading}>
        <div className="flex items-center gap-5 p-3">
          <Button
            onClick={async () => {
              setLoading(true);
              const conf = editorRef.current?.getValue();
              const res = await updateConf(conf);
              if (res) {
                message.success("配置更新成功");
              } else {
                message.error("配置更新失败");
              }
              setLoading(false);
            }}
          >
            更新配置
          </Button>
          <Button
            onClick={async () => {
              setLoading(true);
              const res = await reloadConf();
              if (res) {
                message.success("配置重载成功");
              } else {
                message.error("配置重载失败");
              }
              setLoading(false);
            }}
          >
            重载配置
          </Button>
        </div>
      </Spin>
      <CodeMirrorEditor value={value} height={height} ref={editorRef} />
    </div>
  );
}
export default FrpEditor;
