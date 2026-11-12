import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

function getDatabaseUrl(): string {
  if (process.env.VERCEL) {
    const tmpDbPath = "/tmp/dev.db";
    if (!fs.existsSync(tmpDbPath)) {
      const bundledDbPath = path.join(process.cwd(), "prisma", "dev.db");
      if (fs.existsSync(bundledDbPath)) {
        const stagedPath = `${tmpDbPath}.${process.pid}.tmp`;
        fs.copyFileSync(bundledDbPath, stagedPath);
        fs.chmodSync(stagedPath, 0o666);
        if (!fs.existsSync(tmpDbPath)) {
          fs.renameSync(stagedPath, tmpDbPath);
        } else {
          fs.unlinkSync(stagedPath);
        }
      }
    }
    return `file:${tmpDbPath}`;
  }

  return process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
}

const databaseUrl = getDatabaseUrl();
if (!process.env.DATABASE_URL || process.env.VERCEL) {
  process.env.DATABASE_URL = databaseUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
