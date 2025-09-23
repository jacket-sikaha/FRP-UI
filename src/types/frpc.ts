import { ProxyBaseConfig } from "./proxies";
import { TLSConfig, WebServerConfig } from "./webServer";

export interface FrpcConfig extends ClientCommonConfig {
  proxies: ProxyBaseConfig[];
  [key: string]: unknown;
}

export type ClientCommonConfig = {
  auth?: AuthClientConfig; // 鉴权配置。
  user?: string; // 用户名，设置此参数后，代理名称会被修改为 {user}.{proxyName}，避免代理名称和其他用户冲突。
  serverAddr?: string; // 连接服务端的地址。
  serverPort?: number; // 连接服务端的端口，默认为 7000。
  natHoleStunServer?: string; // xtcp 打洞所需的 stun 服务器地址，默认为 stun.easyvoip.com?:3478。
  dnsServer?: string; // 使用 DNS 服务器地址，默认使用系统配置的 DNS 服务器，指定此参数可以强制替换为自定义的 DNS 服务器地址。
  loginFailExit?: boolean; // 第一次登陆失败后是否退出，默认为 true。
  udpPacketSize?: number;
  includes?: string[];
  start?: string[]; //指定启用部分代理，当配置了较多代理，但是只希望启用其中部分时可以通过此参数指定，默认为全部启用
  webServer?: WebServerConfig; // 服务端 Web 配置。
  log?: LogConfig; // 日志配置。
  transport?: ClientTransportConfig;
  virtualNet?: {
    address: string;
  };
};

export type AuthClientConfig = {
  method: string; // 鉴权方式，可选值为 token 或 oidc，默认为 token。
  additionalScopes: string[]; // 鉴权信息附加范围，可选值为 HeartBeats 和 NewWorkConns
  token: string; // 在 method 为 token 时生效，客户端需要设置一样的值才能鉴权通过。与 tokenSource 字段互斥。
  oidc?: AuthOIDCClientConfig; // oidc 鉴权配置。
};

export type AuthOIDCClientConfig = {
  clientID?: string; // oidc 客户端 ID。
  clientSecret?: string; // oidc 客户端密钥。
  audience?: string; // oidc 受众范围。
  scope?: string; // oidc 作用域。
  tokenSource?: ValueSource; // oidc 令牌来源。
  tokenEndpointURL?: string; // oidc 令牌端点 URL。
};

export type ValueSource = {
  type: string;
  file?: {
    path: string;
  };
};

export type LogConfig = {
  to?: string; // 日志输出文件路径，如果为 console，则会将日志打印在标准输出中。	No
  level?: string; // 日志级别，可选值为 trace, debug, info, warn, error，默认级别为 info。	No
  maxDays?: number; // 日志文件最多保留天数，默认为 3 天。	No
  disablePrintColor?: boolean; // 禁用标准输出中的日志颜色
};

export type ClientTransportConfig = {
  protocol?: string; // 和 frps 之间的通信协议，可选值为 tcp, kcp, quic, websocket, wss。默认为 tcp。	No
  dialServerTimeout?: number; // 连接服务端的超时时间，默认为 10s。	No
  dialServerKeepalive?: number; // 和服务端底层 TCP 连接的 keepalive 间隔时间，单位秒。	No
  connectServerLocalIP?: string; // 连接服务端时所绑定的本地 IP。	No
  proxyURL?: string; // 连接服务端使用的代理地址，格式为 {protocol}://user:passwd@192.168.1.128:8080 protocol 目前支持 http、socks5、ntlm。	No
  poolCount?: number; // 连接池大小。	No
  tcpMux?: boolean; // TCP 多路复用，默认启用。	No
  tcpMuxKeepaliveInterval?: number; // tcp_mux 的心跳检查间隔时间。	No
  heartbeatInterval?: number; // 向服务端发送心跳包的间隔时间，默认为 30s。建议启用 tcp_mux_keepalive_interval，将此值设置为 -1。	No
  heartbeatTimeout?: number; // 和服务端心跳的超时时间，默认为 90s。	No
  quic?: {
    keepalivePeriod?: number; // 默认值为 10 秒。	No
    maxIdleTimeout?: number; // 默认值为 30 秒。	No
    maxIncomingStreams?: number; // 默认值为 100000。	No
  };
  tls?: {
    enable?: boolean; // 是否和服务端之间启用 TLS 连接，默认启用。	No
    disableCustomTLSFirstByte?: boolean; // 启用 TLS 连接时，不发送 0x17 特殊字节。默认为 true。当配置为 true 时，无法和 vhostHTTPSPort 端口复用。
  } & TLSConfig;
};
