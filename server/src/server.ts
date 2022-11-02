import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";

import { z } from "zod";

const prisma = new PrismaClient({
  log: ["query"]
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  });

  fastify.register(cors, {
    origin: true
  });

  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();
    return { count };
  });

  fastify.get("/users/count", async () => {
    const count = await prisma.user.count();
    return { count };
  });

  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();
    return { count };
  });

  fastify.post("/pools", async (req, res) => {
    const createPoolBody = z.object({
      title: z.string()
    });
    const { title } = createPoolBody.parse(req.body);

    // Validação de codigo recebido pelo body,e geração de um id único
    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();
    // Criação do Bolão no Prisma, com dados retornados pelo body.
    await prisma.pool.create({
      data: {
        title,
        code
      }
    });
    return res.status(201).send({ code });
  });

  await fastify.listen({ port: 8080, host: "0.0.0.0" });
}

bootstrap();
