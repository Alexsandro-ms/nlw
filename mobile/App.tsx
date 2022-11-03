// Bibliotecas
import { NativeBaseProvider, StatusBar } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold
} from "@expo-google-fonts/roboto";
// Contextos
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { THEME } from "./src/styles/theme";
// Components
import { Loading } from "./src/components/Loading";
// Pages
import { SignIn } from "./src/screens/Signin";
// import { NewPool } from "./src/screens/NewPool";
// import { FindPool } from "./src/screens/FindPool";
// import { Pools } from "./src/screens/Pools";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={"transparent"}
          translucent
        />
        {fontsLoaded ? <SignIn /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
