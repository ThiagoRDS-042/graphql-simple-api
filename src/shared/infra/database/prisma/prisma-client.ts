import { PrismaClient } from "@prisma/client";

import { hashPassword } from "./middlewares/hash-password";

export const prisma = new PrismaClient({
  log: [{ emit: "stdout", level: "query" }],
});

prisma.$use(hashPassword);
