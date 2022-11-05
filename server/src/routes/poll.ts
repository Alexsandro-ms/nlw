/* Importação de modulos e componentes de suas libs */
import { FastifyInstance } from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function pollRoutes(fastify: FastifyInstance) {
  /* Uma rota que retorna o número de bolões no banco de dados. */
  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();
    return { count };
  });

  fastify.post("/pools", async (request, response) => {
    // Validando o titulo recebido pelo body
    const createPoolBody = z.object({
      title: z.string()
    });

    /* Desestruturando o título do corpo da solicitação. */
    const { title } = createPoolBody.parse(request.body);

    /* Associando a função de gerar id curtos e únicos (ShortUniqueId) a variável generate */
    const generate = new ShortUniqueId({ length: 6 });
    /* Chamando a função generate para gerar o código e transformando-o em maiúsculo */
    const code = String(generate()).toUpperCase();

    try {
      /* Um middleware que verifica o token JWT. */
      await request.jwtVerify();

      /* Criando um novo bolão com dados completos, recebido pelo body. */
      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,
          participants: {
            create: {
              userId: request.user.sub
            }
          }
        }
      });
    } catch (err) {
      /* Criando um novo bolão no banco de dados, apenas com title e o code */
      await prisma.pool.create({
        data: {
          title,
          code
        }
      });
    }

    /* Retornando o código do bolão criado. */
    return response.status(201).send({ code });
  });

  fastify.post(
    "/pools/join",
    { onRequest: [authenticate] },
    async (request, response) => {
      // Validando o código recebido pelo body
      const joinPollBody = z.object({
        code: z.string()
      });

      /* Desestruturando o cósdigo do corpo da solicitação. */
      const { code } = joinPollBody.parse(request.body);

      /* Procurando uma enquete com o código recebido no corpo da requisição. */
      const poll = await prisma.pool.findUnique({
        where: {
          code
        },
        include: {
          participants: {
            where: {
              userId: request.user.sub
            }
          }
        }
      });

      /* Se não existir um bolão, ele retornará uma mensagem informando que não foi encontrado */
      if (!poll) {
        return response.status(400).send({
          message: "Poll not found."
        });
      }

      /* Isso está verificando se o usuário já está no bolão */
      if (poll.participants.length > 0) {
        return response.status(400).send({
          message: "User already join this poll."
        });
      }

      /* Verificando se não existe um proprietário do bolão. fará o primeiro usuario proprietário */
      if (!poll.ownerId) {
        await prisma.pool.update({
          where: {
            id: poll.id
          },
          data: {
            ownerId: request.user.sub
          }
        });
      }

      /* Criando um novo participante no banco de dados. */
      await prisma.participant.create({
        data: {
          poolId: poll.id,
          userId: request.user.sub
        }
      });

      /* Retornando uma resposta com um código de status de 201 e enviando um objeto vazio. */
      return response.status(201).send();
    }
  );

  fastify.get(
    "/pools",
    {
      onRequest: [authenticate]
    },

    /* Esta é uma função que está retornando uma lista de bolões */
    async (request) => {
      const polls = await prisma.pool.findMany({
        where: {
          participants: {
            some: {
              userId: request.user.sub
            }
          }
        },
        include: {
          _count: {
            select: {
              participants: true
            }
          },
          participants: {
            select: {
              id: true,
              user: {
                select: {
                  avatarUrl: true
                }
              }
            },
            take: 4
          },
          owner: {
            select: {
              name: true,
              id: true
            }
          }
        }
      });

      return { polls };
    }
  );

  fastify.get(
    "/pools/:id",
    {
      onRequest: [authenticate]
    },
    async (request) => {
      /* Validando parâmetro id  */
      const getPollsParams = z.object({
        id: z.string()
      });
      /* Desestruturando o id do getPollsParams.parse(request.params) */
      const { id } = getPollsParams.parse(request.params);
      /* Consultando e retornando uma lista de pesquisas. */
      const polls = await prisma.pool.findUnique({
        where: {
          id
        },
        include: {
          _count: {
            select: {
              participants: true
            }
          },
          participants: {
            select: {
              id: true,
              user: {
                select: {
                  avatarUrl: true
                }
              }
            },
            take: 4
          },
          owner: {
            select: {
              name: true,
              id: true
            }
          }
        }
      });

      return { polls };
    }
  );
}
