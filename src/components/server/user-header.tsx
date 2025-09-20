import { auth } from "@/auth";
import { signOutAction } from "@/lib/server-action";
import { Avatar } from "antd";
import React from "react";

async function UserHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="bg-white shadow-sm">
      <div className="px-10">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center w-10">
            <a href="#" className="flex items-center">
              <span className="font-bold text-gray-800">Brand</span>
            </a>
          </div>

          <div className="flex items-center">
            <div className="relative group">
              {user && (
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
                  <span className="text-sm font-medium text-gray-800 hidden sm:inline">
                    {user?.username}
                  </span>
                  <i className="fa fa-angle-down text-gray-500 text-xs transition-transform group-hover:rotate-180"></i>
                </button>
              )}

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  个人资料
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  设置
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  //   onClick={() => {
                  // signOutAction();
                  //   }}
                >
                  退出
                </a>
              </div>
            </div>

            <button className="ml-4 md:hidden text-gray-600 hover:text-primary">
              <i className="fa fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default UserHeader;
