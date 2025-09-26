import { Drawer, DrawerProps } from "antd";
import { PropsWithChildren } from "react";

export type DrawerContainerProps = {
  title?: string;
  show?: boolean;
  size?: DrawerProps["size"];
  onClose?: () => void;
};

function DrawerContainer({
  children,
  title = "修改frp",
  show = false,
  size = "default",
  onClose,
}: PropsWithChildren<DrawerContainerProps>) {
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
