import { FrpcConfig } from "@/types/frpc";
import { createContext, useContext } from "react";

export const FrpcConfCtx = createContext<{
  config: FrpcConfig;
  setConfig?: (config: FrpcConfig) => void;
}>(
  {} as {
    config: FrpcConfig;
  }
);

export const useFrpcConf = () => useContext(FrpcConfCtx);

export const ThemeCtx = createContext<{
  theme: "light" | "dark";
  setTheme?: (theme: "light" | "dark") => void;
}>(
  {} as {
    theme: "light" | "dark";
  }
);

export const useTheme = () => useContext(ThemeCtx);
