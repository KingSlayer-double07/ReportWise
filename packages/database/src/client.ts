import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export { ClassLevel, PlanTier, Role, SchoolStatus, Stream, TermNumber } from "@prisma/client";
export type { Prisma } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
