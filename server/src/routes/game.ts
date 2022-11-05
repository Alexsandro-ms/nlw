/* Importação de modulos e componentes de suas libs */
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {
  /* Rota de retorno de jogos */
  fastify.get(
    "/pools/:id/games",
    {
      onRequest: [authenticate]
    },
    /**
     * Retorna uma lista de jogos e, para cada jogo, retorna um palpite se o usuário tiver feito um,
     * caso contrário retorna null.
     * @param {FastifyInstance} fastify - FastifyInstance
     */
    async (request) => {
      const getPollsParams = z.object({
        id: z.string()
      });
      const { id } = getPollsParams.parse(request.params);
      const games = await prisma.game.findMany({
        orderBy: {
          date: "desc"
        },
        include: {
          guesses: {
            where: {
              participant: {
                userId: request.user.sub,
                poolId: id
              }
            }
          }
        }
      });
      return {
        games: games.map((game) => {
          return {
            ...game,
            guess: game.guesses.length > 0 ? game.guesses[0] : null,
            guesses: undefined
          };
        })
      };
    }
  );
}
