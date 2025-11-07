import { Drawer, DrawerProps } from "antd";
import {
  PropsWithChildren,
  RefObject,
  useImperativeHandle,
  useState,
} from "react";

export type DrawerContainerProps = {
  title?: string;
  size?: DrawerProps["size"];
  ref: RefObject<{
    onShow: () => void;
    onClose: () => void;
  }>;
};

function DrawerContainer({
  children,
  title = "修改frp",
  size = "default",
  ref,
}: PropsWithChildren<DrawerContainerProps>) {
  const [show, setShow] = useState(false);
  const onClose = () => setShow(() => false);
  const onShow = () => setShow(() => true);
  useImperativeHandle(
    ref,
    () => {
      return {
        onShow,
        onClose,
      };
    },
    []
  );

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
