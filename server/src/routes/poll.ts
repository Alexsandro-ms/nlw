import { FastifyInstance } from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function pollRoutes(fastify: FastifyInstance) {
  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();
    return { count };
  });

  fastify.post("/pools", async (request, response) => {
    const createPoolBody = z.object({
      title: z.string()
    });

    const { title } = createPoolBody.parse(request.body);

    // Validação de codigo recebido pelo body,e geração de um id único
    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    try {
      await request.jwtVerify();
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
      await prisma.pool.create({
        data: {
          title,
          code
        }
      });
    }
    // Criação do Bolão no Prisma, com dados retornados pelo body.

    return response.status(201).send({ code });
  });

  fastify.post(
    "/pools/join",
    { onRequest: [authenticate] },
    async (request, response) => {
      const joinPollBody = z.object({
        code: z.string()
      });

      const { code } = joinPollBody.parse(request.body);

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

      if (!poll) {
        return response.status(400).send({
          message: "Poll not found"
        });
      }

      if (poll.participants.length > 0) {
        return response.status(400).send({
          message: "User already join this poll."
        });
      }

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

      await prisma.participant.create({
        data: {
          poolId: poll.id,
          userId: request.user.sub
        }
      });

      return response.status(201).send();
    }
  );

  fastify.get(
    "/pools",
    {
      onRequest: [authenticate]
    },
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
      const getPollsParams = z.object({
        id: z.string()
      });
      const { id } = getPollsParams.parse(request.params);
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
