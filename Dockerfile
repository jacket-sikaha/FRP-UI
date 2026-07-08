# Stage 1: 使用官方 Node.js 作为构建环境
FROM node:alpine
WORKDIR /app

# 将项目源代码复制到工作目录
COPY . .

# 安装 pnpm
RUN npm install -g pnpm

RUN pnpm approve-builds @tailwindcss/oxide sharp unrs-resolver && pnpm install

# 暴露端口（Next.js 默认端口为 3000）
EXPOSE 3000

# 使用 pnpm start 来启动应用
CMD ["pnpm", "start"]