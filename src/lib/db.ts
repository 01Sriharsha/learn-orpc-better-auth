import { PrismaClient } from "@generated/client/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

if (typeof window === "undefined") {
  // For Node.js environment
  const ws = await import("ws").then((mod) => mod.WebSocket);
  neonConfig.webSocketConstructor = ws;
} else {
  // For browser environments, use native WebSocket
  neonConfig.webSocketConstructor = WebSocket;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
