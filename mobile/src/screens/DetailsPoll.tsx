/* Importando os componentes das respectivas bibliotecas. */
import { useState, useEffect } from "react";
import { Share } from "react-native";
import { useRoute } from "@react-navigation/native";
import { HStack, Toast, VStack } from "native-base";

/* Importando os componentes da pasta de componentes. */

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PollCardProps } from "../components/PollCard";
import { PollHeader } from "../components/PollHeader";
import { EmptyMyPollList } from "../components/EmptyMyPollList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

/* Importando a conexão com o backend */
import { api } from "../service/api";

/* Definindo o tipo de parâmetros de rota. */
interface RouteParams {
  id: string;
}

export function DetailsPoll() {
  /* React Hooks usados para gerenciar o estado de componentes. */
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [pollDetails, setPollDetails] = useState<PollCardProps>(
    {} as PollCardProps
  );

  /* Obtendo os parâmetros de rota. */
  const route = useRoute();
  /* Desestruturando o objeto route.params e atribuindo a propriedade id à variável id. */
  const { id } = route.params as RouteParams;

  /**
   * Estou tentando buscar os detalhes de uma enquete e, se falhar, quero mostrar uma mensagem de brinde.
   * @returns {
   *   "id": " ID do bolão ",
   *   "name": "Nome do bolão",
   *   "description": " descrição do bolão",
   *   "startDate": "2020-04-01T00:00:
   */
  const fetchPollDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${id}`);

      setPollDetails(response.data.polls);
    } catch (err) {
      if (err) {
        return Toast.show({
          title: "Não foi possível carregar os detalhes, do bolão!",
          placement: "top",
          bgColor: "red.500"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeShare = async () => {
    /* Uma função que é chamada quando o usuário clica no botão de compartilhamento. */

    await Share.share({
      message: pollDetails.code
    });
  };

  /* Um React Hook que é chamado após cada renderização do id. */
  useEffect(() => {
    // Chamando a função responsável pela chamada dos detalhes do bolão
    fetchPollDetails();
  }, [id]);

  {
    /* Verificando se os dados estão carregando. Se estiver carregando,
     mostrará o componente de carregamento. */
    if (isLoading) {
      return <Loading />;
    }
    return (
      <VStack flex={1} bgColor="gray.900">
        <Header
          title={pollDetails.title}
          showBackButton
          showShareButton
          onShare={handleCodeShare}
        />
        {pollDetails._count?.participants > 0 ? (
          <VStack px={5} flex={1}>
            <PollHeader data={pollDetails} />
            <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
              <Option
                title="Seus Palpites"
                isSelected={optionSelected === "guesses"}
                onPress={() => setOptionSelected("guesses")}
              />
              <Option
                title="Ranking do grupo"
                isSelected={optionSelected === "ranking"}
                onPress={() => setOptionSelected("ranking")}
              />
            </HStack>

            <Guesses poolId={pollDetails.id} code={pollDetails.code} />
          </VStack>
        ) : (
          <EmptyMyPollList code={pollDetails.code} />
        )}
      </VStack>
    );
  }
}
