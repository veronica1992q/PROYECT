import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EventsScreen from "../screens/EventsScreen";
import { useAppContext } from "../context/AppContext";

const Tab = createBottomTabNavigator();

function LogoutScreen({ navigation }) {
  const { logout } = useAppContext();

  const handleLogout = () => {
    logout();

    // 🔴 RESETEA TODA LA NAVEGACIÓN Y VA AL LOGIN
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Cerrar Sesión
      </Button>
    </View>
  );
}

export default function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "CreateEvent") iconName = "event";
          else if (route.name === "Events") iconName = "list";
          else if (route.name === "Logout") iconName = "logout";

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1976d2",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: "Crear Evento" }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ title: "Mis Eventos" }} />
      <Tab.Screen name="Logout" component={LogoutScreen} options={{ title: "Cerrar Sesión" }} />

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: { backgroundColor: "#d32f2f", paddingHorizontal: 20 },
});
