/* Importando os componentes das bibliotecas. */
import { Center, Text, Icon } from "native-base";
import { Fontisto } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";

/* Importando o arquivo logo.svg da pasta assets. */
import Logo from "../assets/logo.svg";

/* Importando o componente Button */
import { Button } from "../components/Button";

export function SignIn() {
  /* Desestruturando o gancho useAuth. */
  const { signIn, isUserLoading } = useAuth();

  return (
    <Center flex={1} bgColor={"gray.900"} p={7}>
      <Logo width={212} height={40} />
      <Button
        title="Entrar com o google"
        leftIcon={
          <Icon as={Fontisto} name="google" color={"white"} size={"md"} />
        }
        type={"Secondary"}
        mt={12}
        onPress={signIn}
        isLoading={isUserLoading}
        _loading={{
          _spinner: {
            color: "white"
          }
        }}
      />
      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {"\n"} do seu e-mail para criação
        da sua conta.
      </Text>
    </Center>
  );
}
