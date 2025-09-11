import { getToken } from "next-auth/jwt";
import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  console.log(
    "经过了middleware-----------------token:",
    token?.basicAuthHeader
  );

  if (!req.auth && req.nextUrl.pathname !== "/auth/signin") {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // 克隆请求头并设置一个新的头 `x-hello-from-middleware1`
  const requestHeaders = new Headers(req.headers);
  if (token?.basicAuthHeader) {
    requestHeaders.set("authorization", token.basicAuthHeader as string);
  }
  // 你也可以在 NextResponse.next 中设置请求头
  const response = NextResponse.next({
    request: {
      // 新的请求头
      headers: requestHeaders,
    },
  });

  // // 设置一个新的响应头 `x-hello-from-middleware2`
  // response.headers.set("x-hello-from-middleware2", "hello");
  return response;
});
export const config = {
  /*
   * 匹配所有的路径除了以这些作为开头的：
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
