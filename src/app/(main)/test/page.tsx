import { auth } from "@clerk/nextjs/server";

export const runtime = "edge";

export default async function UserPage() {
  const token = await (await auth()).getToken();

  const hoge: { message: string } = await (
    await fetch("http://localhost:8787", {
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    })
  ).json();

  return hoge.message;
}
