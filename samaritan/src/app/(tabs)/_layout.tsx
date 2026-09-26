import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
      <Tabs
        screenOptions={{
            tabBarActiveTintColor: "#FFFFFF",
            tabBarInactiveTintColor: "#FFFFFF",
            headerStyle: {
                backgroundColor: "#FFFFFF",
            },
            headerShadowVisible: false,
            headerTintColor: "#327EFF",
            tabBarStyle: {
                backgroundColor: "#327EFF",
            },
        }}
      >
      <Tabs.Screen
      name = "index"
      options={{
          headerTitle: "Welcome to Samaritan!",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 32, paddingVertical: 5 },
          title: "Home",
          tabBarIcon: ({focused, color}) => (
              <Ionicons
              name ={focused ? "home-sharp" : "home-outline"}
              color = {color}
              size={30}
              />
          ),
      }}
      />
      <Tabs.Screen
      name = "map"
      options={{
          headerTitle: "Maps",
          headerTitleAlign: "center",
          title: "Maps",
          tabBarIcon: ({focused, color}) => (
              <Ionicons
                  name={
                      focused ? "calendar" : "calendar-outline"
                  }
                  color = {color}
                  size={24}
              />
          ),
      }}
      />
      <Tabs.Screen
      name = "alerts"
      options={{
          headerTitle: "Alerts",
          headerTitleAlign: "center",
          title: "Alerts",
          tabBarIcon: ({focused, color}) => (
              <Ionicons
                  name={
                      focused ? "alert-circle" : "alert-circle-outline"
                  }
                  color = {color}
                  size={24}
              />
          ),
      }}
      />
      <Tabs.Screen
      name = "profile"
      options={{
          headerTitle: "Profile",
          headerTitleAlign: "center",
          title: "Profile",
          tabBarIcon: ({focused, color}) => (
              <Ionicons
                  name={
                      focused ? "person" : "person-outline"
                  }
                  color = {color}
                  size={24}
              />
          ),
      }}
      />
    </Tabs>
  );
}
