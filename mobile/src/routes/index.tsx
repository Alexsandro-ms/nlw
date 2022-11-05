import { Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native";

// Custom Hook de autenticação
import { useAuth } from "../hooks/useAuth";

//  Rotas
import { AppRoutes } from "./app.routes";
import { SignIn } from "../screens/Signin";

export function Routes() {
  /* Está desestruturando o objeto de usuário do hook useAuth. */
  const { user } = useAuth();

  return (
    <Box flex={1} bg="gray.900">
      <NavigationContainer>
        {/* Se existir um name em um usuario, retornará as rotas, caso não, retornará a rota de signIn */}
        {user.name ? <AppRoutes /> : <SignIn />}
      </NavigationContainer>
    </Box>
  );
}
