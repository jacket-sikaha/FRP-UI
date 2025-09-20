"use client";

import { ProxyBaseConfig } from "@/types/proxies";
import { Drawer } from "antd";
import { PropsWithChildren } from "react";
import ProxiesForm from "./proxies-form";

function DrawerEditor({
  value,
  title = "修改frp",
  show = false,
  onClose,
}: PropsWithChildren<{
  value?: ProxyBaseConfig;
  title?: string;
  show?: boolean;
  onClose?: () => void;
}>) {
  return (
    <div className="">
      <Drawer
        destroyOnHidden
        title={title}
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={show}
      >
        <ProxiesForm val={value} />
      </Drawer>
    </div>
  );
}

export default DrawerEditor;
