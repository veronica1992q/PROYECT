import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";

import { AppProvider, useAppContext } from "./src/context/AppContext";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import DashboardTabs from "./src/navigation/DashboardTabs";
import AdminPanelScreen from "./src/screens/AdminPanelScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, loadingAuth, paperTheme } = useAppContext();

  // Esperar a que se cargue el token del AsyncStorage
  if (loadingAuth) return null; // o puedes poner Splash Screen

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          {!user ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Dashboard" component={DashboardTabs} />
              <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
            </>
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
