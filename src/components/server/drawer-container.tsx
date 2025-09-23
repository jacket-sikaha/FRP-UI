import { Drawer } from "antd";
import { PropsWithChildren } from "react";

function DrawerContainer({
  children,
  title = "修改frp",
  show = false,
  onClose,
}: PropsWithChildren<{
  title?: string;
  show?: boolean;
  onClose?: () => void;
}>) {
  return (
    <Drawer
      destroyOnHidden
      title={title}
      closable={{ "aria-label": "Close Button" }}
      onClose={onClose}
      open={show}
    >
      {children}
    </Drawer>
  );
}

export default DrawerContainer;
