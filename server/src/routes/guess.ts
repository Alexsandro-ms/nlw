/* Importação de modulos e componentes de suas libs */
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  /* Uma rota que retorna o número de palpites */
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();
    return { count };
  });

  fastify.post(
    "/pools/:poolId/games/:gameId/guesses",
    {
      onRequest: [authenticate]
    },
    async (request, response) => {
      /* Validando Parametros */
      const createGuessesParams = z.object({
        poolId: z.string(),
        gameId: z.string()
      });

      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number()
      });

      /* Desestruturando as informações validadas */
      const { poolId, gameId } = createGuessesParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      /* Verificando se o usuário é um participante do bolão. */
      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId: request.user.sub
          }
        }
      });

      /* trantando caso não tenha um usuário */
      if (!participant) {
        return response.status(400).send({
          message: "User not allowed to create a guess inside this poll."
        });
      }

      /* Verificando se o usuário já enviou um palpite para este jogo nesse bolão */
      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId
          }
        }
      });

      /* trantando caso já tenha um palpite */
      if (guess) {
        return response.status(400).send({
          message: "User already sent a guess to this game on this poll."
        });
      }

      /* Verificando se o jogo existe. */
      const game = await prisma.game.findUnique({
        where: {
          id: gameId
        }
      });

      /* trantando caso nãp tenha um jogo */
      if (!game) {
        return response.status(400).send({
          message: "Game not found"
        });
      }

      /* trantando caso a data do jogo tenha expirado */
      if (game.date < new Date()) {
        return response.status(400).send({
          message: "You cannoty send guesses after the game date."
        });
      }

      /* Criando um novo palpite.
       * Caso tenha passado nas
       * validações anteriores */

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          firstTeamPoints,
          secondTeamPoints
        }
      });

      /* Retornando uma resposta com um código de status de 201 e enviando um corpo vazio. */
      return response.status(201).send();
    }
  );
}
