import Navbar from "@/components/layout/navbar";
import { orpcQC } from "@/lib/orpc";
import { QueryClient } from "@tanstack/react-query";

export default async function HomePage() {
  const { data } = await new QueryClient().fetchQuery(
    orpcQC.section.get.queryOptions({ input: { page: 1, pageSize: 10 } })
  );
  return (
    <div className="min-h-screen w-full max-w-400 mx-auto">
      <Navbar />
      <div className="mt-20 space-y-8">
        <div>{JSON.stringify(data, null, 4)}</div>
      </div>
    </div>
  );
}
