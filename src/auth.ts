import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { createBasicAuthHeader } from "./lib";
import dayjs from "dayjs";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}
const maxAge = 120;
const providers: Provider[] = [
  Credentials({
    id: "custom-credentials",
    credentials: {
      username: { label: "Username", type: "text" },
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
        console.log("apiResponse.ok:", apiResponse.ok);
        if (!apiResponse.ok) {
          throw new InvalidLoginError();
        }

        // 5. 返回用户对象（会被用于创建会话）
        return {
          username: username as string,
          id: Date.now().toString(),
          basicAuthHeader,
        };
      } catch (error) {
        console.log("error:", error);
        // 可以根据错误类型返回更具体的信息
        return null;
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
    maxAge: 120, // 单位：秒
  },
  jwt: {
    maxAge: 120, // 单位：秒
  },

  // 3. 配置加密密钥（生产环境必须通过环境变量设置）
  secret: process.env.AUTH_SECRET,
  providers,
  pages: {
    // signIn: "/signin",
    signIn: "/auth/signin",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("{ token, user }:", { user });
      if (user) {
        // 首次登录设置过期时间
        const { basicAuthHeader, ...safeUser } = user;
        token.expires = Date.now() + maxAge * 1000;
        token.user = { ...safeUser };
        token.basicAuthHeader = basicAuthHeader;
      }
      // 只有当token已过期时才返回空对象
      if (token.expires && Date.now() > (token.expires as number)) {
        return {};
      } else if (token.expires) {
        // 每次请求时刷新过期时间（滑动过期）
        token.expires = Date.now() + maxAge * 1000;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("session--------------------------:");
      // 将用户信息添加到 session
      if (token && session.user) {
        session.user = token.user as typeof session.user;
        // 添加过期时间到 session
        session.expires = dayjs(
          token.expires as number
        ).toDate() as typeof session.expires;
        session.ddd = dayjs(token.expires as number).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        // session.token = token;
      }
      return session;
    },
  },
});
