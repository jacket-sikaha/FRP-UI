"use client";

import { signOutAction } from "@/lib/server-action";
import { Avatar, Dropdown, MenuProps } from "antd";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTheme } from "@/context";

function UserHeader() {
  const { data: session } = useSession();
  const user = session?.user as User & { username: string };
  const { theme, setTheme } = useTheme();
  const items: MenuProps["items"] = [
    {
      label: (
        <a
          href="#"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          个人资料
        </a>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: (
        <a
          href="#"
          className="block px-4 py-2 text-sm hover:bg-gray-100"
          onClick={async () => {
            signOutAction();
          }}
        >
          退出
        </a>
      ),
      danger: true,
      key: "3",
    },
  ];

  return (
    <header className="shadow-sm">
      <div className="px-10">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center w-10">
            <div className="flex items-center font-bold">Brand</div>
          </div>

          <div className="flex items-center gap-3">
            <div
              onClick={() => setTheme?.(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center size-8"
            >
              {theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
            </div>
            <div className="relative group">
              {user && (
                <Dropdown
                  menu={{
                    items,
                  }}
                >
                  <button className="flex items-center gap-3 space-x-2 focus:outline-none">
                    <Avatar
                      style={{
                        verticalAlign: "middle",
                        backgroundColor: "#f56a00",
                      }}
                      className="size-8"
                    >
                      {user?.username.slice(0, 2)}
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:block">
                      {user?.username}
                    </span>
                  </button>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default UserHeader;
