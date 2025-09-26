"use client";
import { FrpcConfig } from "@/types/frpc";
import { Button } from "antd";
import { useState } from "react";
import DrawerContainer from "../server/drawer-container";
import FrpcCommonConfigForm from "./frpc-common-config-form";
import { FrpcConfCtx } from "@/context";

function FrpcConfDrawer({ value }: { value?: FrpcConfig }) {
  const [show, setShow] = useState(false);

  return (
    <FrpcConfCtx.Provider
      value={{
        config: value || ({} as FrpcConfig),
        setConfig: () => {},
      }}
    >
      <div>
        <Button type="primary" onClick={() => setShow(true)}>
          修改基础配置
        </Button>
        <DrawerContainer
          show={show}
          onClose={() => setShow(false)}
          size="large"
        >
          <FrpcCommonConfigForm />
        </DrawerContainer>
      </div>
    </FrpcConfCtx.Provider>
  );
}

export default FrpcConfDrawer;
