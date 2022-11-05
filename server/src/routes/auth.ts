/* Importação de modulos e componentes de suas libs */
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

/**
 * Ele recebe uma solicitação, verifica se o usuário está autenticado e, em caso afirmativo, retorna o usuário.
 * @param {FastifyInstance} fastify - FastifyInstance
 */

export async function authRoutes(fastify: FastifyInstance) {
  /* Rota de verificação de usuario (via header) e retorno de informações do usuario */
  fastify.get(
    "/me",
    {
      onRequest: [authenticate]
    },
    async (request) => {
      return { user: request.user };
    }
  );
  /* Criando um novo usuário. */
  fastify.post("/users", async (request) => {
    const createUserBody = z.object({
      access_token: z.string()
    });
    const { access_token } = createUserBody.parse(request.body);
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    const userData = await userResponse.json();
    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url()
    });
    const userInfo = userInfoSchema.parse(userData);

    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture
        }
      });
    }

    const token = fastify.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl
      },
      {
        sub: user.id,
        expiresIn: "7 days"
      }
    );

    return { token };
  });
}
