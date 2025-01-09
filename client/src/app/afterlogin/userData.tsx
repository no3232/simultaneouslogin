"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserData() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      alert("다른 브라우저나 탭에서 로그인했습니다.");
      // await fetch("http://localhost:3000/auth/logout", {
      //   credentials: "include",
      // });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const channel = new BroadcastChannel("auth_channel");
    const tabId = Math.random().toString(36).substring(7);
    channel.postMessage({ type: "channel_on", tabId });

    channel.onmessage = (event) => {
      switch (event.data.type) {
        case "channel_on":
          if (event.data.tabId !== tabId) {
            channel.postMessage({
              type: "logout",
            });
          }
          break;
        case "logout":
          handleLogout();
          channel.close();
          break;
      }
    };

    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:3000/users", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log(error);
        alert("인증 실패");
        channel.close();
        router.push("/");
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 5000);

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Data</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
