import { redirect } from "next/navigation";

// lib/fetch-api.js
async function clientFetch(url: string | URL, options: RequestInit = {}) {
  const response = await fetch(url, options);

  // 统一检查响应状态
  if (response.status === 401) {
    // 区分客户端和服务端环境
    console.log("typeof window:", typeof window);
    if (typeof window !== "undefined") {
      // 客户端：使用window.location跳转
      window.location.href = "/auth/signin";
      // 客户端跳转需要中断后续执行
    } else {
      // 服务端：使用Next的redirect函数
      redirect(`/auth/signin`);
    }
  }

  return response;
}

export default clientFetch;
