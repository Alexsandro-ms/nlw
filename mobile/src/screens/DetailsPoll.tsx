import { useState, useEffect } from "react";
import { Share } from "react-native";

import { useRoute } from "@react-navigation/native";
import { HStack, Toast, VStack } from "native-base";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

import { api } from "../service/api";
import { PollCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export function DetailsPoll() {
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [pollDetails, setPollDetails] = useState<PollCardProps>(
    {} as PollCardProps
  );

  const route = useRoute();
  const { id } = route.params as RouteParams;

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
    await Share.share({
      message: pollDetails.code
    });
  };

  useEffect(() => {
    fetchPollDetails();
  }, [id]);

  {
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
            <PoolHeader data={pollDetails} />
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
          <EmptyMyPoolList code={pollDetails.code} />
        )}
      </VStack>
    );
  }
}
