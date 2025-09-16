"use client";
import { langs } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";
import { basicSetup, EditorView } from "codemirror";
import { Ref, useEffect, useImperativeHandle, useRef } from "react";

export type EditorRefType = {
  getValue: () => string;
  focus: () => void;
};

function CodeMirrorEditor({
  value = "",
  height = "300",
  ref,
}: {
  value: string;
  height: string;
  ref: Ref<EditorRefType>;
}) {
  const codeMirrorInstance = useRef<EditorView>(null);

  useEffect(() => {
    const parent = document.querySelector(".editor-view");
    if (!parent) return;
    codeMirrorInstance.current = new EditorView({
      parent: parent,
      doc: value,

      extensions: [
        githubLight,
        basicSetup,
        langs.toml(),
        EditorView.theme({
          "&": { height: `${height}px` },
          ".cm-scroller": { overflow: "auto" },
        }),
      ],
    });

    // 清理函数
    return () => {
      if (codeMirrorInstance.current) {
        codeMirrorInstance.current.destroy();
        codeMirrorInstance.current = null;
      }
    };
  }, [value]);
  // 向外部暴露方法
  useImperativeHandle(ref, () => ({
    // 获取当前编辑器值
    getValue: () => codeMirrorInstance.current?.state.doc.toString() || "",
    // 聚焦编辑器
    focus: () => codeMirrorInstance.current?.focus(),
  }));

  return <div className="editor-view size-full"></div>;
}

export default CodeMirrorEditor;
