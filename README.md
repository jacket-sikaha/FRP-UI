# frp-ui

基于 frp 的服务端部分 API 定制化自己的客户端

## 数据结构

- FRP 配置服务状态 http://127.0.0.1/api/status（GET获取状态数据）

- FRP 服务器配置
  token = （服务端 token）
  server_addr = （服务器端 IP 地址）
  server_port = （服务器端端口）
  admin_addr = （原生 WEB 客户端 IP 地址）
  admin_port = （原生 WEB 客户端端口）

- FRP 客户端配置
  必填：
  type = （协议类型）
  local_ip = （内网主机 IP）
  local_port = （内网主机端口）
  remote_port = （远端端口）

  frpc-name = 配置名称 **不能有中文**

- FRP 配置文件编辑

- 注意点：

1. 必填字段根据情况变化：

   tcp/udp =》remote_port

   http =》 vhost_http_port

   https =》 vhost_https_port

2. 可选字段不能重复，全部同理

3. 客户端配置名称不能重复

4. 顺序必填在先，自定义后面（全部同理）

5. 自定义字段的键值不能有中文，特殊字符

- 选项管理 Collapse 组件
  1. 添加/删除都在这一页
  2. **客户端**的编辑都会有选项提示，他的每次点击编辑，数据库都会有 name 的变化 ，用 set
  3.

## 接口

http://127.0.0.1/api/status（GET获取状态数据）
http://127.0.0.1/api/config（GET获取文件数据）（PUT上传文件数据）
http://127.0.0.1/api/reload（GET重载）

## 参考图片

- 添加表单---编辑里不允许自定义添加相同配置

  ![add](http://dns.huagecloud.top:8097/api/files/1686039918717.png)

- 客户端配置表格显示

  ![table](http://dns.huagecloud.top:8097/api/files/1686039955796.png)

- 服务端配置表格显示

  ![table2](http://dns.huagecloud.top:8097/api/files/1686039961145.png)

- 选项管理 - 选项显示配置名称，即那条数据在使用这个选项

- ![配置状态](http://dns.huagecloud.top:8097/api/files/1686239263788.png)

[common]
server_addr = xxxxxxxxxxxxx
server_port = xxxxxxxxxxxx
admin_addr = 10.10.10.204
admin_port = xxxxxxxxx
#admin_user = xxxxxx
#admin_pwd = xxxxxxxxxxxx

[FRP_WEB_UI123]
type = tcp
local_ip = 10.10.10.204
local_port = 1001
remote_port = 14725

[frp-web12]
type = http
local_ip = 10.10.10.204
local_port = 8889
vhost_http_port = 80
vhost_https_port = 443
custom_domains = xxxxxxxxxxxx

## linux 服务器测试待解决问题

##### 客户端配置的可选选项带注释的显示逻辑（注释了就不在编辑 modal 显示，反之显示）

##### 自定义配置选项删除前做个提示，并且配置文件原有就有的选项添加完成后自动读取文件同步一次数据

##### 文件读取同步选项的算法有问题，原本就有的选项为 0 了会直接删除了而不是 key:[]存储

##### 客户端配置必选项值不能有英文

