import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import UserHeader from "@/components/client/user-header";
import ThemeConfig from "@/components/client/theme-config";

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
        <div className="h-svh w-full grid grid-rows-[auto_1fr]">
          <ThemeConfig>
            <SessionProvider>
              <UserHeader />
              <AntdRegistry>
                <main className="h-full overflow-auto">{children}</main>
              </AntdRegistry>
            </SessionProvider>
          </ThemeConfig>
        </div>
      </body>
    </html>
  );
}
