export type WebServerConfig = {
  addr?: string; // webServer 监听地址，默认为 127.0.0.1。	No
  port: number; // webServer 监听端口。	Yes
  user?: string; // HTTP BasicAuth 用户名。	No
  password?: string; // HTTP BasicAuth 密码。	No
  assetsDir?: string; // 静态资源目录，Dashboard 使用的资源默认打包在二进制文件中，通过指定此参数使用自定义的静态资源。	No
  pprofEnable?: boolean; // 启动 Go HTTP pprof，用于应用调试。	No
  tls?: TLSConfig;
};

export type TLSConfig = {
  certFile: string; // TLS 证书文件路径。	Yes
  keyFile: string; // TLS 密钥文件路径。	Yes
  trustedCaFile?: string; // CA 证书文件路径。	No
  serverName?: string; // TLS Server 名称。	No
};
