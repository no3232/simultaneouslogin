"use client";
// import { headers } from "next/headers";
import UserData from "./userData";

// const getUser = async () => {
//   const headersList = await headers();
//   const cookie = headersList.get("cookie");
//   console.log("Cookie:", cookie);

//   const response = await fetch("http://localhost:3000/users", {
//     credentials: "include",
//     headers: {
//       Cookie: cookie || "",
//     },
//   });

//   const data = await response.json();
//   console.log("Response data:", data);
//   return data;
// };

export default function AfterLogin() {
  // const user = await getUser();
  // console.log("User data:", user);
  return <UserData />;
}
