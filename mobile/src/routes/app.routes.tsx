import { useTheme } from "native-base";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Icones
import { PlusCircle, SoccerBall } from "phosphor-react-native";

// Páginas
import { SignIn } from "../screens/Signin";
import { NewPoll } from "../screens/NewPoll";
import { FindPoll } from "../screens/FindPoll";
import { Polls } from "../screens/Polls";
import { DetailsPoll } from "../screens/DetailsPoll";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  /* É uma função que retorna um objeto com as cores e tamanhos do tema. */
  const { colors, sizes } = useTheme();
  const size = sizes[6];
  /* ------------------------------------------------------------------- */
  return (
    // Estilização da navegação
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: "beside-icon",
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: "absolute",
          height: sizes[22],
          backgroundColor: colors.gray[800]
        },
        tabBarItemStyle: {
          position: "relative",
          top: Platform.OS === "android" ? -10 : 0
        }
      }}
    >
      {/* Rotas da aplicação */}

      {/* Criação de Bolão */}
      <Screen
        name="newPoll"
        component={NewPoll}
        options={{
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
          tabBarLabel: "Novo bolão"
        }}
      />

      {/* Bolões */}
      <Screen
        name="polls"
        component={Polls}
        options={{
          tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />,
          tabBarLabel: "Meus bolões"
        }}
      />

      {/* Buscar Bolão */}
      <Screen
        name="findPoll"
        component={FindPoll}
        options={{ tabBarButton: () => null }}
      />

      {/* Detalhes do Bolão */}
      <Screen
        name="details"
        component={DetailsPoll}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}
