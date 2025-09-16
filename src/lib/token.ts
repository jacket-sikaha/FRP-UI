import { getToken } from "next-auth/jwt";

export const getAuth = async (request: Request) => {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  if (!token?.basicAuthHeader) {
    return false;
  }
  return token.basicAuthHeader as string;
};
