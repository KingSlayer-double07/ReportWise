import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

export { ClassLevel, PlanTier, Role, SchoolStatus, Stream, TermNumber } from "./generated/prisma/client.js";
export type { Prisma } from "./generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
