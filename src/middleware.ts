import { getToken } from "next-auth/jwt";
import { auth } from "./auth";

export default auth(async (req) => {
  // console.log("req.auth===========
  // ========:", req.cookies.getAll());
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  console.log("token:", token);
  if (!req.auth && req.nextUrl.pathname !== "/auth/signin") {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
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
