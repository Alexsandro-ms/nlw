/* Importando o framework Fastify e seus respectivos plugins  */
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

/* Importando as rotas da pasta de rotas. */
import { pollRoutes } from "./routes/poll";
import { userRoutes } from "./routes/user";
import { guessRoutes } from "./routes/guess";
import { gameRoutes } from "./routes/game";
import { authRoutes } from "./routes/auth";

async function bootstrap() {
  /* Criando uma nova instância do Fastify. */
  const fastify = Fastify({
    logger: true
  });

  /* Um plugin que permite configurar CORS do servidor. */
  fastify.register(cors, {
    origin: true
  });

  /* Registrando o plug-in JWT. */
  await fastify.register(jwt, {
    secret: "nlwcopa"
  });

  /* Cadastrando as rotas. */
  fastify.register(pollRoutes);
  fastify.register(userRoutes);
  fastify.register(guessRoutes);
  fastify.register(gameRoutes);
  fastify.register(authRoutes);

  /* Definindo Rotas do servidor web/ios e android */
  await fastify.listen({ port: 8080, host: "0.0.0.0" });
}

/* executando a função bootstrap */
bootstrap();
