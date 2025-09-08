import { auth } from "./auth";

export default auth((req) => {
  console.log("req.auth:", req.auth);
  console.log("req.nextUrl:", req.nextUrl);
  if (!req.auth && req.nextUrl.pathname !== "/auth/signin") {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
