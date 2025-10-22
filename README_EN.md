# FRP-UI

<div align="center">
  <a href="https://github.com/sikaha/FRP-UI">
    <img src="https://raw.githubusercontent.com/fatedier/frp/master/docs/_static/logo.png" alt="FRP Logo" height="80">
  </a>
  <p>
    <b>A modern, user-friendly web interface for FRP management</b>
  </p>
</div>

## 📋 Project Overview

FRP-UI is a modern management interface for FRP (Fast Reverse Proxy), providing an intuitive and user-friendly way to configure and manage FRP proxy services. Built with Next.js 15 and Ant Design 5, it supports user authentication, proxy configuration management, status monitoring, and more.

## 🚀 Key Features

- ✅ User authentication system to ensure configuration security
- ✅ Real-time monitoring of FRP proxy status
- ✅ Visual management of proxy configurations (add, edit, delete)
- ✅ Support for multiple proxy types (TCP, UDP, HTTP, HTTPS, etc.)
- ✅ Online configuration file editing
- ✅ Real-time configuration reloading
- ✅ Docker containerized deployment

## 🛠️ Technology Stack

| Technology/Framework | Version | Purpose |
|---------------------|---------|--------|
| Next.js | ^15.5.2 | React Framework |
| React | ^19.1.0 | UI Library |
| Ant Design | ^5.27.1 | UI Component Library |
| TypeScript | ^5 | Type System |
| Tailwind CSS | ^4 | Styling Framework |
| NextAuth.js | ^5.0.0-beta.29 | Authentication System |
| smol-toml | 1.4.2 | TOML Configuration Parser |
| react-query | 3.39.3 | Data Request Management |
| immer | 10.1.3 | Immutable Data Management |

## 📦 Installation & Deployment

### Docker Deployment (Recommended)

```bash
docker-compose up -d
```

### Docker Compose Configuration Example

```yaml
version: "3.8"

services:
  frp-ui:
    image: docker.io/sikaha/frp-ui:latest
    container_name: frp-ui
    ports:
      - "3000:3000"
    environment:
      - ORIGIN_SERVER=http://localhost:3000  # FRP server API address
      - AUTH_SECRET=your-secret  # Replace with actual AUTH_SECRET
    restart: unless-stopped
    networks:
      - frp-network

networks:
  frp-network:
    driver: bridge
```

### Local Development

```bash
# Install dependencies
pnpm install

# Generate authentication secret
pnpm auth

# Start development server
pnpm dev

# Build production version
pnpm build

# Start production server
pnpm start
```

## 🔧 Environment Variables

| Environment Variable | Description | Default Value |
|---------------------|-------------|--------------|
| ORIGIN_SERVER | FRP server API address | - |
| AUTH_SECRET | NextAuth.js authentication secret | - |
| PORT | Application port | 3000 |

## 📱 Interface Features

### 1. Status Monitoring Page

The status monitoring page displays the running status of all FRP proxies, including proxy name, protocol type, local address, remote address, and running status.

### 2. Proxy Configuration Management

The proxy configuration management page provides an intuitive interface to add, edit, and delete FRP proxy configurations, supporting multiple proxy types and advanced configuration options.

### 3. Configuration File Editing

The configuration file editing page provides an online editor that supports direct editing of FRP configuration files with real-time updates.

## 📡 API Interfaces

FRP-UI interacts with the FRP server through the following API interfaces:

- `GET /api/status` - Get FRP proxy status
- `GET /api/config` - Get FRP configuration file
- `PUT /api/config` - Update FRP configuration file
- `GET /api/reload` - Reload FRP configuration

## 📝 Notes

1. Proxy names cannot contain Chinese characters
2. Required fields vary depending on proxy type:
   - TCP/UDP proxies require remote_port
   - HTTP proxies require vhost_http_port
   - HTTPS proxies require vhost_https_port
3. Proxy configuration names cannot be duplicated
4. Custom field keys cannot contain Chinese characters or special characters

## 🤝 Contribution

Contributions to FRP-UI are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or suggestions, please submit issues in the GitHub repository.

**View Chinese Documentation**: [README.md](README.md)