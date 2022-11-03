import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

// Rotas
import { pollRoutes } from "./routes/poll";
import { userRoutes } from "./routes/user";
import { guessRoutes } from "./routes/guess";
import { gameRoutes } from "./routes/game";
import { authRoutes } from "./routes/auth";

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  });

  fastify.register(cors, {
    origin: true
  });

  await fastify.register(jwt, {
    secret: "nlwcopa"
  });

  fastify.register(pollRoutes);
  fastify.register(userRoutes);
  fastify.register(guessRoutes);
  fastify.register(gameRoutes);
  fastify.register(authRoutes);

  await fastify.listen({ port: 8080, host: "0.0.0.0" });
}

bootstrap();
