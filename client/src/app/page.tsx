"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [loginData, setLoginData] = useState({
    userid: "",
    password: "",
  });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginData),
    })
      .then((res) => {
        if (!res.ok) {
          alert("인증 실패");
          throw new Error("Failed to login");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        const channel = new BroadcastChannel("auth_channel");
        channel.postMessage({ type: "logout" });
        router.push("/afterlogin");
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <form onSubmit={handleLogin}>
        <input
          className="border-2 border-gray-300 rounded-md p-2"
          type="text"
          name="userid"
          onChange={handleChange}
          value={loginData.userid}
        />
        <input
          className="border-2 border-gray-300 rounded-md p-2"
          type="password"
          name="password"
          onChange={handleChange}
          value={loginData.password}
        />
        <button className="bg-blue-500 text-white rounded-md p-2" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
