# FRP-UI

**View English Documentation**: [README_EN.md](README_EN.md)

[![DeepWiki Index](https://deepwiki.com/badge.svg)](https://deepwiki.com/jacket-sikaha/FRP-UI)

<div align="center">
  <a href="https://github.com/sikaha/FRP-UI">
    <img src="https://raw.githubusercontent.com/fatedier/frp/master/docs/_static/logo.png" alt="FRP Logo" height="80">
  </a>
  <p>
    <b>基于FRP的现代化、用户友好的管理界面</b>
  </p>
</div>

## 📋 项目概述

FRP-UI是一个基于FRP 的现代化管理界面，提供直观易用的方式来配置和管理FRP代理服务。本项目使用Next.js 15和Ant Design 5构建，支持用户认证、代理配置管理、状态监控等功能。

## 🚀 主要功能

- ✅ 用户认证系统，保障配置安全
- ✅ FRP代理状态实时监控
- ✅ 代理配置可视化管理（添加、编辑、删除）
- ✅ 支持多种代理类型（TCP, UDP, HTTP, HTTPS等）
- ✅ 配置文件在线编辑
- ✅ 配置实时重载
- ✅ Docker容器化部署

## 🛠️ 技术栈

| 技术/框架 | 版本 | 用途 |
|----------|------|------|
| Next.js | ^15.5.2 | React框架 |
| React | ^19.1.0 | UI库 |
| Ant Design | ^5.27.1 | UI组件库 |
| TypeScript | ^5 | 类型系统 |
| Tailwind CSS | ^4 | 样式框架 |
| NextAuth.js | ^5.0.0-beta.29 | 认证系统 |
| smol-toml | 1.4.2 | TOML配置解析 |
| react-query | 3.39.3 | 数据请求管理 |
| immer | 10.1.3 | 不可变数据管理 |

## 📦 安装与部署

### Docker部署（推荐）

```bash
docker-compose up -d
```

### Docker Compose配置示例

```yaml
version: "3.8"

services:
  frp-ui:
    image: docker.io/sikaha/frp-ui:latest
    container_name: frp-ui
    ports:
      - "3000:3000"
    environment:
      - ORIGIN_SERVER=http://localhost:3000  # FRP服务器API地址
      - AUTH_SECRET=your-secret  # 替换为实际的AUTH_SECRET
    restart: unless-stopped
    networks:
      - frp-network

networks:
  frp-network:
    driver: bridge
```

### 本地开发

```bash
# 安装依赖
pnpm install

# 生成认证密钥
pnpm auth

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 🔧 环境变量配置

| 环境变量 | 描述 | 默认值 |
|---------|------|--------|
| ORIGIN_SERVER | FRP服务器API地址 | - |
| AUTH_SECRET | NextAuth.js认证密钥 | - |
| PORT | 应用端口 | 3000 |

## 📱 界面功能介绍

### 1. 状态监控页面

展示所有FRP代理的运行状态，包括代理名称、协议类型、本地地址、远程地址和运行状态等信息。

### 2. 代理配置管理

提供直观的界面来添加、编辑和删除FRP代理配置，支持多种代理类型和高级配置选项。

### 3. 配置文件编辑

提供在线编辑器，支持直接编辑FRP配置文件，实时更新配置。

## 📡 API接口

FRP-UI与FRP服务器通过以下API接口交互：

- `GET /api/status` - 获取FRP代理状态
- `GET /api/config` - 获取FRP配置文件
- `PUT /api/config` - 更新FRP配置文件
- `GET /api/reload` - 重载FRP配置

## 📝 注意事项

1. 代理名称不能包含中文字符
2. 必填字段根据代理类型不同而变化：
   - TCP/UDP代理需要设置remote_port
   - HTTP代理需要设置vhost_http_port
   - HTTPS代理需要设置vhost_https_port
3. 代理配置名称不能重复
4. 自定义字段的键值不能包含中文字符和特殊字符

## 🤝 贡献

欢迎提交Issue和Pull Request来改进FRP-UI！

## 📄 许可证

本项目采用MIT许可证 - 详情请查看[LICENSE](LICENSE)文件

## 📞 联系

如有问题或建议，请在GitHub仓库提交Issue。


