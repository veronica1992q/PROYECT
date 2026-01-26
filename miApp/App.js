import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";

import { AppProvider, useAppContext } from "./src/context/AppContext";

// Pantallas de autenticación
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

// Navegación principal
import DashboardTabs from "./src/navigation/DashboardTabs";
import AdminPanelScreen from "./src/screens/AdminPanelScreen";

// Pantallas de eventos
import EventsScreen from "./src/screens/EventsScreen";
import CreateEventScreen from "./src/screens/CreateEventScreen";
import EditEventScreen from "./src/screens/EditEventScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, loadingAuth, paperTheme } = useAppContext();

  // Esperar a que se cargue el token del AsyncStorage
  if (loadingAuth) return null; // aquí podrías poner un SplashScreen

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

              {/* Pantallas de eventos */}
              <Stack.Screen name="Events" component={EventsScreen} />
              <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
              <Stack.Screen name="EditEvent" component={EditEventScreen} />
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
