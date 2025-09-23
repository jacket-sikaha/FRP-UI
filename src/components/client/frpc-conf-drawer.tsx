"use client";
import { ClientCommonConfig } from "@/types/frpc";
import React, { useState } from "react";
import DrawerContainer from "../server/drawer-container";
import FrpcCommonConfigForm from "./frpc-common-config-form";
import { Button } from "antd";

function FrpcConfDrawer({ value }: { value?: ClientCommonConfig }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Button type="primary" onClick={() => setShow(true)}>
        修改基础配置
      </Button>
      <DrawerContainer show={show} onClose={() => setShow(false)} size="large">
        <FrpcCommonConfigForm value={value} />
      </DrawerContainer>
    </div>
  );
}

export default FrpcConfDrawer;
