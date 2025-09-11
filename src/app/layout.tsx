import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "@ant-design/v5-patch-for-react-19";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FRP Manager UI",
  description:
    "This is an example site to demonstrate how to use NextAuth.js for authentication",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <main className="h-svh w-screen">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
