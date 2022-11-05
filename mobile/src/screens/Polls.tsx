/* Importando os componentes necessários das bibliotecas. */
import { useCallback, useState } from "react";
import { VStack, Icon, Toast, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

/* Importando os componentes da pasta de componentes. */
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolCard, PollCardProps } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";

/* importando conexão com o banco de dados */
import { api } from "../service/api";

export function Polls() {
  /* Desestruturando a função de navegação do hook useNavigation. */
  const { navigate } = useNavigation();
  /* Um Hook de uma função que retorna um valor, com estado e uma função para atualizá-lo. */
  const [isLoading, setIsLoading] = useState(true);
  const [polls, setPolls] = useState<PollCardProps[]>([]);

  /**
   * FetchPolls é uma função que busca enquetes da API e define o estado da variável de enquetes
   * aos dados de resposta.
   */
  const fetchPolls = async () => {
    try {
      setIsLoading(true);

      const response = await api.get("/pools");

      setPolls(response.data.polls);
    } catch (err) {
      console.log(err);
      Toast.show({
        title: "Não foi possível carregar os bolões",
        placement: "top",
        bgColor: "red.500"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* Um Hook que é chamado quando a tela está com foco. */
  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  return (
    <VStack flex={1} bgColor={"gray.900"}>
      <Header title="Meus bolões" />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="Buscar bolão por código"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate("findPoll")}
        />
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate("details", { id: item.id })}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  );
}
