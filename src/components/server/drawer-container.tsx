import { Drawer, DrawerProps } from "antd";
import { PropsWithChildren } from "react";

function DrawerContainer({
  children,
  title = "修改frp",
  show = false,
  size = "default",
  onClose,
}: PropsWithChildren<{
  title?: string;
  show?: boolean;
  size?: DrawerProps["size"];
  onClose?: () => void;
}>) {
  return (
    <Drawer
      destroyOnHidden
      title={title}
      closable={{ "aria-label": "Close Button" }}
      onClose={onClose}
      open={show}
      size={size}
    >
      {children}
    </Drawer>
  );
}

export default DrawerContainer;
