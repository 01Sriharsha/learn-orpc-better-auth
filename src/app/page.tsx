"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { orpcQC } from "@/lib/orpc/orpc.client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { isLoading, data } = useQuery(orpcQC.auth.me.queryOptions());
  useEffect(() => {
    if (!data?.data.isOnboarded) {
      router.replace("/onboarding");
    }
  }, [data]);
  return (
    <div>
      <Button onClick={async () => await authClient.signOut()}>Signout</Button>
    </div>
  );
}

// import { client } from "@/lib/orpc";

// export default async function HomePage() {
//   console.log("Global client", globalThis.$client);

//   const hello = await client.hello();
//   return <div>{hello.message}</div>;
// }
