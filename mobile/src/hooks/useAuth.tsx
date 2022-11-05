import { useContext } from "react";
import { AuthContext, AuthContextDataProps } from "../contexts/AuthContext";

export function useAuth(): AuthContextDataProps {
  /* Definindo e retornando contexto de autenticação */

  const context = useContext(AuthContext);
  return context;
}
