import "@fastify/jwt";

/* Uma definição de tipo para o objeto JWT. */
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      sub: string;
      name: string;
      avatarUrl: string;
    };
  }
}
