import { PrismaClient } from "@prisma/client";

/* Criando uma nova instância da classe PrismaClient. */
export const prisma = new PrismaClient({
  log: ["query"]
});
