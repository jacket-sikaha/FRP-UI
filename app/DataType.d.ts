declare interface FrpsDataType {
  optional?: { labelIsWork: boolean; label: string; value: string }[];
  key: React.Key;
  token: string; //（服务端 token）
  server_addr: string; //（服务器端IP地址）
  server_port: string; //	（服务器端端口）
  admin_addr: string; // （原生WEB客户端IP地址）
  admin_port: string; // （原生WEB客户端端口）
  isWork: boolean;
  name: string;
  // 定义索引签名
  [key: string]: string;
}

declare interface FrpcDataType {
  optional?: {
    labelIsWork: boolean;
    label: string;
    value: string;
  }[];
  key: React.Key;
  type: string; // （协议类型）
  local_ip: string; // （内网主机IP）
  local_port: string; // （内网主机端口）
  remote_port?: string; // （远端端口 需要根据协议类型变化）
  vhost_http_port?: string;
  vhost_https_port?: string;
  name: string; // 配置名称
  isWork: boolean;
  // 定义索引签名
  [key: string]: string;
}

declare type confDataType = {
  frps: FrpsDataType[];
  frpc: FrpcDataType[];
};

declare interface StatusDataType {
  http: StatusTableDataType[];
  https: StatusTableDataType[];
  tcp: StatusTableDataType[];
}

declare type StatusTableDataType = {
  key: React.Key;
  err: string;
  local_addr: string;
  name: string;
  plugin: string;
  remote_addr: string;
  status: string;
  type: string;
};
