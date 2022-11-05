/* Importando os componentes de suas repectivas libs */
import { useState } from "react";
import { Heading, VStack, Text, useToast, Toast } from "native-base";

/* Importando o arquivo logo.svg da pasta assets. */
import Logo from "../assets/logo.svg";

/* Importando os componentes da pasta de componentes. */
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

// Importando a conexão com o banco de dados
import { api } from "../service/api";

export function NewPoll() {
  /* Definindo os Hooks */
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePollCreate = async () => {
    /* Verificando se o título está vazio. */

    if (!title.trim()) {
      return Toast.show({
        title: "Informe um nome para seu bolão.",
        placement: "top",
        bgColor: "red.500"
      });
    }
    try {
      /* Definindo o loading como true */
      setIsLoading(true);

      /* Enviando title para o backend */
      await api.post("/polls", { title: title.toUpperCase() });

      /* retornando uma mensagem*/
      Toast.show({
        title: "Bolão criado com sucesso!",
        placement: "top",
        bgColor: "green.500"
      });
    } catch (err) {
      /* retornando mensagem de erro */
      Toast.show({
        title: "Não foi Possível criar o bolão!",
        placement: "top",
        bgColor: "red.500"
      });
    } finally {
      /* Configurando o título como uma string vazia e configurando o carregamento como false. */
      setTitle("");
      setIsLoading(false);
    }
  };

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />
      <VStack mt={8} mx={5} alignItems={"center"}>
        <Logo />
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa {"\n"} e compartilhe entre amigos!
        </Heading>
        <Input
          mb={2}
          placeholder="Nome do seu bolão"
          onChangeText={setTitle}
          value={title}
        />
        <Button
          title="Criar meu bolão"
          onPress={handlePollCreate}
          isLoading={isLoading}
        />
        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
