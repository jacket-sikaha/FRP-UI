import NextAuth, { CredentialsSignin } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { createBasicAuthHeader } from "./lib";
import { randomUUID } from "node:crypto";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

const providers: Provider[] = [
  Credentials({
    id: "custom-credentials",
    credentials: {
      username: { label: "Username" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      console.log("credentials:", credentials);
      const { username, password } = credentials;
      if (!username || !password) {
        throw new Error("Invalid credentials.");
      }
      try {
        // 1. 创建 Basic Auth 头部
        const basicAuthHeader = createBasicAuthHeader(username, password);

        // 2. 调用需要 Basic Auth 的外部 API 进行验证
        const apiResponse = await fetch(process.env.ORIGIN_SERVER as string, {
          headers: {
            Authorization: basicAuthHeader,
          },
        });
        // 3. 处理 API 响应
        if (!apiResponse.ok) {
          throw new InvalidLoginError();
        }

        // 5. 返回用户对象（会被用于创建会话）
        return {
          username: username as string,
          id: randomUUID(),
          basicAuthHeader,
        };
      } catch (error) {
        // 可以根据错误类型返回更具体的信息
        throw new Error(
          error instanceof Error ? error.message : "Authentication failed"
        );
      }
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  // 1. 设置会话策略为 JWT
  session: {
    strategy: "jwt",
    // 2. 配置 JWT 有效期（与第三方服务对齐，如 24 小时）
    maxAge: 60, // 单位：秒
  },

  // 3. 配置加密密钥（生产环境必须通过环境变量设置）
  secret: process.env.AUTH_SECRET,
  providers,
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    /**
     * JWT 生成/更新时的回调
     * 作用：将用户信息存入 JWT，或在 JWT 过期前更新
     */
    async jwt({ token, user }) {
      console.log("token:", token);
      console.log("user:", user);
      // 首次登录时，user 存在，将 basicAuthHeader 存入 token
      if (user) {
        token.basicAuthHeader = user?.basicAuthHeader;
      }

      return token;
    },

    /**
     * 会话生成时的回调
     * 作用：控制客户端能获取的会话数据
     */
    async session({ session, token }) {
      console.log("111111111 token:", token);
      console.log("11111111 session:", session);
      // 将 JWT 中的 basicAuthHeader 同步到会话
      if (session.user && token.basicAuthHeader) {
        session.user.basicAuthHeader = token.basicAuthHeader;
      }
      return session;
    },

    /**
     * 可选：控制是否允许 JWT 刷新
     */
    async redirect({ url, baseUrl }) {
      // 登录后重定向逻辑（默认重定向到 baseUrl）
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});
