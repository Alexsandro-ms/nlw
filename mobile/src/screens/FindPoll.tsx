/* Importando os componentes de suas respectivas libs. */
import { useState } from "react";
import { Heading, VStack, Toast } from "native-base";
import { useNavigation } from "@react-navigation/native";

/* Importando os componentes dos componentes da pasta. */
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

import { api } from "../service/api";

export function FindPoll() {
  /* Defininfo os Hooks. */
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const { navigate } = useNavigation();

  // Função para entrar em um bolão
  const handleJoinPoll = async () => {
    try {
      setIsLoading(true);

      const response = await api.post("/pools/join", { code });

      if (!code.trim()) {
        return Toast.show({
          title: "Informe um código!",
          placement: "top",
          bgColor: "blue.600"
        });
      }

      Toast.show({
        title: "Você Entrou!",
        placement: "top",
        bgColor: "yellow.500"
      });

      navigate("polls");
    } catch (err) {
      console.log(err);

      if (err.response?.data?.message === "Poll not found.") {
        return Toast.show({
          title: "Bolão não encontrado!",
          placement: "top",
          bgColor: "red.500"
        });
      }

      if (err.response?.data?.message === "User already join this poll.") {
        return Toast.show({
          title: "Usuário já entrou no bolão!",
          placement: "top",
          bgColor: "blue.600"
        });
      }
      Toast.show({
        title: "Não foi possível entrar no bolão!",
        placement: "top",
        bgColor: "red.500"
      });
      setIsLoading(false);
    }
  };

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar código" showBackButton />
      <VStack mt={8} mx={5} alignItems={"center"}>
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de {"\n"}
          seu código único.
        </Heading>
        <Input
          mb={2}
          placeholder="Qual seu código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
        />
        <Button title="Buscar bolão" onPress={handleJoinPoll} />
      </VStack>
    </VStack>
  );
}
