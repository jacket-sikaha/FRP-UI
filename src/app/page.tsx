"use client";
import { signOutAction } from "@/lib/server-action";
import { Button } from "antd";
import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Index() {
  const session = useSession();
  const router = useRouter();
  return (
    <div className="px-10">
      <div className="flex flex-col gap-6 p-5">
        <h1 className="text-3xl font-bold">NextAuth.js Example</h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              signOutAction();
            }}
          >
            signOut
          </Button>
          <Button
            onClick={() => {
              router.push("/manage");
            }}
          >
            go to manage
          </Button>
        </div>
        <div className="flex flex-col rounded-md bg-red-100 text-green-200">
          <div className="rounded-t-md bg-yellow-200 p-4 font-bold">
            Current Session
          </div>
          <pre
            className="whitespace-pre-wrap overflow-x-clip text-pretty break-all px-4"
            onClick={() => {
              fetch("/ddd/test").then((res) => res.json());
            }}
          >
            {JSON.stringify(session, null, 4)}
          </pre>
        </div>
      </div>
    </div>
  );
}
