/**
 * Recebendod um objeto FastifyRequest e retorna uma promessa que resolve o resultado da chamada da
 * função jwtVerify() no objeto de solicitação.
 * @param {FastifyRequest} request - FastifyRequest - Este é o objeto de solicitação que é passado para o
 * route handler.
 */
import { FastifyRequest } from "fastify";

export async function authenticate(request: FastifyRequest) {
  await request.jwtVerify();
}
