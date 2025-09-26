import { FrpcConfig } from "@/types/frpc";
import { createContext, useContext } from "react";

export const FrpcConfCtx = createContext<{
  config: FrpcConfig;
  setConfig: (config: FrpcConfig) => void;
}>(
  {} as {
    config: FrpcConfig;
    setConfig: (config: FrpcConfig) => void;
  }
);

export const useFrpcConf = () => useContext(FrpcConfCtx);
