import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Today from "../pages/TodayPage/Today";
import { Ionicons } from "@expo/vector-icons";

const AppNavigator = () => {
  const Stack = createStackNavigator();
  const Tabs = createBottomTabNavigator();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#12100E",
        },
        tabBarLabelStyle: {
          color: "#D4A373",
        },
      }}
    >
      <Tabs.Screen
        name="Bugün"
        component={Today}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "cafe" : "cafe-outline"}
              size={size}
              color={"#D4A373"}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};
export default AppNavigator;
