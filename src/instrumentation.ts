export const runtime = "nodejs";

export async function register() {
  console.log("✅ Instrumentation registered");
  console.log("✅ orpc server - client registered");
  await import("@/lib/orpc/orpc.server");
}
