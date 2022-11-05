import { createContext, ReactNode, useState, useEffect } from "react";

// Autenticação Com Google Bibliotecas
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// Conexão com Banco de dados
import { api } from "../service/api";

/* Uma função que é chamada para concluir o processo de autenticação. */
WebBrowser.maybeCompleteAuthSession();

// Interfaces

/* Definindo a forma do objeto do usuário. */
interface UserProps {
  name: string;
  avatarUrl: string;
}
/* Definindo a forma do objeto que será retornado pelo contexto. */
export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}
/* Uma definição de tipo para as props que o componente receberá. */
interface AuthProviderProps {
  children: ReactNode;
}

/* Criando um contexto com um objeto vazio como valor padrão. */
export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  /* Uma variável de estado que é usada para mostrar uma tela de carregamento quando o usuário está entrando. */
  const [isUserLoading, setIsUserLoading] = useState(false);
  /* Uma variável de estado que é usada para armazenar as informações do usuário. */
  const [user, setUser] = useState<UserProps>({} as UserProps);

  /* Uma atribuição de desestruturação que é usada para extrair dados de matrizes ou objetos em
  variáveis. */
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["profile", "email"]
  });

  /**
   * Função de Signin/Signup.
   */
  async function signIn() {
    try {
      /* Definindo o estado de carregamento como true e, em seguida, chamando a função promptAsync. */
      setIsUserLoading(true);
      await promptAsync();
    } catch (err) {
      /* Registrando o erro e depois lançando-o. */
      console.log(err);
      throw err;
    } finally {
      /* Definindo o estado de carregamento como false */
      setIsUserLoading(false);
    }
  }

  async function signInWithGoogle(access_token: string) {
    try {
      /* Definindo o estado de carregamento como true. */
      setIsUserLoading(true);

      /* Enviando o token de acesso ao servidor. */
      const tokenResponse = await api.post("/users", {
        access_token
      });

      /* Configurando o token no cabeçalho da solicitação. */
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${tokenResponse.data.token}`;

      /* Buscando as informações do usuario do servidor */
      const userInfoResponse = await api.get("/me");
      setUser(userInfoResponse.data.user);
    } catch (err) {
      /* Registrando o erro e depois lançando-o. */
      console.log(err);
      throw err;
    } finally {
      /* Definindo o estado de carregamento como false */
      setIsUserLoading(false);
    }
  }

  useEffect(() => {
    /* Verificando se a resposta foi bem-sucedida e se possui um token de acesso. Se isso acontecer, ele chama o
    função signInWithGoogle. */
    if (response?.type === "success" && response.authentication.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        isUserLoading,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
