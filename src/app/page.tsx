"use client";
import { auth, signOut } from "@/auth";
import { useSession, SessionProvider } from "next-auth/react";

export default function Index() {
  const session = useSession();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">NextAuth.js Example</h1>
      <div>
        This is an example site to demonstrate how to use
        <a href="https://nextjs.authjs.dev">NextAuth.js</a> for authentication.
        Check out the
        <a href="/server-example" className="underline">
          Server
        </a>
        and the
        <a href="/client-example" className="underline">
          Client
        </a>
        examples to see how to secure pages and get session data.
      </div>
      <div>
        WebAuthn users are reset on every deploy, don't expect your test user(s)
        to still be available after a few days. It is designed to only
        demonstrate registration, login, and logout briefly.
      </div>
      <div className="flex flex-col rounded-md bg-red-100 text-black">
        <div
          className="rounded-t-md bg-yellow-200 p-4 font-bold"
          onClick={() => {
            signOut(); // 确保正确触发登出
          }}
        >
          Current Session
        </div>
        <pre className="whitespace-pre-wrap break-all px-4 py-6">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
