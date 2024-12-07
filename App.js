import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen_Step1 from "./Screens/RegisterScreen_Step1";
import RegisterScreen_Step2 from "./Screens/RegisterScreen_Step2";
import RegisterScreen_Step3 from "./Screens/RegisterScreen_Step3";
const authStack = createStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer>
      <authStack.Navigator screenOptions={{ headerShown: false }}>
        <authStack.Screen name="Login" component={LoginScreen} />
        <authStack.Screen
          name="Register_Step1"
          component={RegisterScreen_Step1}
          options={{
            headerShown: false,
          }}
        />
        <authStack.Screen
          name="Register_Step2"
          component={RegisterScreen_Step2}
          options={{
            headerShown: false,
          }}
        />
        <authStack.Screen
          name="Register_Step3"
          component={RegisterScreen_Step3}
          options={{
            headerShown: false,
          }}
        />
      </authStack.Navigator>
    </NavigationContainer>
  );
};
export default function App() {
  return <AuthStack />;
}
