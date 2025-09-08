import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { createBasicAuthHeader } from "./lib";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

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
    maxAge: 60, // 单位：秒
  },
  jwt: {
    maxAge: 60, // 单位：秒
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
    // authorized({ auth, request: { nextUrl } }) {
    //   console.log("nextUrl:", nextUrl.pathname);
    //   console.log("auth:", auth);
    //   const isLoggedIn = !!auth?.user;
    //   const isOnDashboard = nextUrl.pathname.startsWith("/");

    //   if (isOnDashboard) {
    //     if (isLoggedIn) return true;
    //     return false;
    //   } else if (isLoggedIn) {
    //     return Response.redirect(new URL("/", nextUrl));
    //   }
    //   return true;
    // },
    /**
     * JWT 生成/更新时的回调
     * 作用：将用户信息存入 JWT，或在 JWT 过期前更新
     */
    // async jwt({ token, user }) {
    //   console.log("token:", token);
    //   console.log("user:", user);
    //   // 首次登录时，user 存在，将 basicAuthHeader 存入 token
    //   if (user) {
    //     token.basicAuthHeader = user?.basicAuthHeader;
    //   }

    //   return token;
    // },

    /**
     * 会话生成时的回调
     * 作用：控制客户端能获取的会话数据
     */
    // async session({ session, token }) {
    //   console.log("111111111 token:", token);
    //   console.log("11111111 session:", session);
    //   // 将 JWT 中的 basicAuthHeader 同步到会话
    //   if (session.user && token.basicAuthHeader) {
    //     session.user.basicAuthHeader = token.basicAuthHeader;
    //   }
    //   return session;
    // },

    async jwt({ token, user }) {
      // 将用户信息添加到 token
      if (user) {
        token.id = user.id;
        token.username = user.username;
        // 设置 token 过期时间为 60 秒后
        token.expires = Date.now() + 60 * 1000;
      }

      // 如果 token 已过期，返回空对象
      if (token.expires && Date.now() > token.expires) {
        return {};
      }

      return token;
    },
    async session({ session, token }) {
      // 将用户信息添加到 session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        // 添加过期时间到 session
        session.expires = token.expires as number;
      }
      return session;
    },
  },
});
