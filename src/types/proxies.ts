export type ProxyBaseConfig = {
  id?: string; // 前端渲染所需ID
  name: string; // 代理名称。	Yes
  type: string; // 代理类型，可选值为 tcp, udp, http, https, tcpmux, stcp, sudp, xtcp。	Yes
  remotePort?: number;
  transport?: ProxyTransport;
  loadBalancer?: {
    group: string; // 负载均衡分组名称，用户请求会以轮询的方式发送给同一个 group 中的代理。	Yes
    groupKey?: string; // 负载均衡分组密钥，用于对负载均衡分组进行鉴权，groupKey 相同的代理才会被加入到同一个分组中。
  };
  healthCheck?: HealthCheckConfig;
  [key: string]: any;
} & ProxyBackend &
  DomainConfig;

// 代理网络层配置
export type ProxyTransport = {
  useEncryption?: boolean; // 是否启用加密功能，启用后该代理和服务端之间的通信内容都会被加密传输，如果 frpc 启用了全局 TLS，则不需要再启用此参数。	No
  useCompression?: boolean; // 是否启用压缩功能，启用后该代理和服务端之间的通信内容都会被压缩传输。	No
  bandwidthLimit?: string; // 设置单个 proxy 的带宽限流，单位为 MB 或 KB，0 表示不限制，如果启用，默认会作用于对应的 frpc。	No
  bandwidthLimitMode?: string; // 限流类型，客户端限流或服务端限流，可选值为 client 和 server，默认为客户端限流。	No
  proxyProtocolVersion?: string; // 启用 proxy protocol 协议的版本，可选值为 v1 和 v2。如果启用，则 frpc 和本地服务建立连接后会发送 proxy protocol 的协议，包含了原请求的 IP 地址和端口等内容。	No
};

export type ProxyBackend = {
  localIP?: string; // 被代理的本地服务 IP，默认为 127.0.0.1。	No
  localPort?: number; // 被代理的本地服务端口。	No
  plugin?: {
    // 客户端插件配置
    type: string;
    [key: string]: string;
  };
};

// 健康检查配置
export type HealthCheckConfig = {
  type: string; // 健康检查类型，可选值为 tcp, http, tls。	Yes
  timeoutSeconds?: number; // 健康检查超时时间(秒)，默认为 3s。	No
  maxFailed?: number; // 健康检查连续错误次数，连续检查错误多少次认为服务不健康，默认为 1。	No
  intervalSeconds?: number; // 健康检查周期(秒)，每隔多长时间进行一次健康检查，默认为 10s。	No
  path?: string; // 健康检查的 HTTP 接口，如果健康检查类型是 http，则需要配置此参数，指定发送 http 请求的 path，例如 /health。
  httpHeaders?: {
    name: string; // Header 名称。
    value: string; // Header 值。
  };
};

export type DomainConfig = {
  customDomains?: string[]; // 自定义域名列表
  subdomain?: string; // 子域名
};
