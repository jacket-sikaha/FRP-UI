"use client";
import { langs } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef } from "react";

function CodeMirrorEditor({ value = "", height = "300" }) {
  const codeMirrorInstance = useRef<EditorView>(null);
  // 用于挂载CodeMirror的DOM元素ref
  const editorRef = useRef(null);
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
  return <div className="editor-view size-full"></div>;
}

export default CodeMirrorEditor;
