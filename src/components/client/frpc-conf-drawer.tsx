"use client";
import { FrpcConfCtx } from "@/context";
import { FrpcConfig } from "@/types/frpc";
import { Button } from "antd";
import { useRef } from "react";
import DrawerContainer, { DrawerContainerProps } from "./drawer-container";
import FrpcCommonConfigForm from "./frpc-common-config-form";

function FrpcConfDrawer({ value }: { value?: FrpcConfig }) {
  const drawerRef = useRef(null) as unknown as DrawerContainerProps["ref"];

  return (
    <FrpcConfCtx.Provider
      value={{
        config: value || ({} as FrpcConfig),
      }}
    >
      <div>
        <Button type="primary" onClick={() => drawerRef.current?.onShow()}>
          修改基础配置
        </Button>
        <DrawerContainer ref={drawerRef} size="large">
          <FrpcCommonConfigForm />
        </DrawerContainer>
      </div>
    </FrpcConfCtx.Provider>
  );
}

export default FrpcConfDrawer;
