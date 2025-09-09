export const runtime = "edge";

export async function register() {
  console.log("✅ Instrumentation registered");
  console.log("✅ orpc server - client registered");
  await import("@/lib/orpc.server");
}
