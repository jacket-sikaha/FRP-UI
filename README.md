# frp-ui
基于frp的服务端部分API定制化自己的客户端

## 数据结构

- FRP服务状态	 http://127.0.0.1/api/status（GET获取状态数据）
- FRP服务器配置
  	token = （服务端 token）
  	server_addr = （服务器端IP地址）
  	server_port = （服务器端端口）
  	admin_addr = （原生WEB客户端IP地址）
  	admin_port = （原生WEB客户端端口）
- FRP客户端配置
  	必填：
  	type = （协议类型） 
  	local_ip = （内网主机IP）
  	local_port = （内网主机端口）
  	remote_port = （远端端口）
- FRP配置文件编辑

## 接口

http://127.0.0.1/api/status（GET获取状态数据）
http://127.0.0.1/api/config（GET获取文件数据）（PUT上传文件数据）
http://127.0.0.1/api/reload（GET重载）

## 参考图片

- 添加表单

  ![add](http://dns.huagecloud.top:8097/api/files/1686039918717.png)

- 客户端配置表格显示

  ![table](http://dns.huagecloud.top:8097/api/files/1686039955796.png)

- 服务端配置表格显示

  ![table2](http://dns.huagecloud.top:8097/api/files/1686039961145.png)