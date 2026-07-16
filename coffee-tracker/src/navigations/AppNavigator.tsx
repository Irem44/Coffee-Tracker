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
        tabBarStyle: {},
        tabBarLabelStyle: {
          color: "#60241E",
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
              color={"#60241E"}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};
export default AppNavigator;
