"use client";
import { auth, signOut } from "@/auth";
import { signOutAction } from "@/lib/server-action";
import { useSession, SessionProvider } from "next-auth/react";

export default function Index() {
  const session = useSession();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">NextAuth.js Example</h1>
      <div
        onClick={() => {
          signOutAction();
        }}
      >
        signOut
      </div>
      <div className="flex flex-col rounded-md bg-red-100 text-black">
        <div className="rounded-t-md bg-yellow-200 p-4 font-bold">
          Current Session
        </div>
        <pre
          className="whitespace-pre-wrap break-all px-4 py-6"
          onClick={() => {
            fetch("/ddd/test").then((res) => res.json());
          }}
        >
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
