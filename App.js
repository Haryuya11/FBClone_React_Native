import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen_Step1 from "./Screens/RegisterScreen_Step1";
import RegisterScreen_Step2 from "./Screens/RegisterScreen_Step2";
import RegisterScreen_Step3 from "./Screens/RegisterScreen_Step3";
import RegisterScreen_Step4_Email from "./Screens/RegisterScreen_Step4_Email";
import RegisterScreen_Step4_Phone from "./Screens/RegisterScreen_Step4_Phone";
import RegisterScreen_Step5 from "./Screens/RegisterScreen_Step5";
import RegisterScreen_Step6 from "./Screens/RegisterScreen_Step6";
import VerifyScreen from "./Screens/VerifyScreen";
import HomeScreen from "./Screens/Mainscreen/HomeScreen";
import PostScreen from "./Screens/Mainscreen/PostScreen";
import ProfileScreen from "./Screens/Mainscreen/ProfileScreen";
import VideoScreen from "./Screens/Mainscreen/VideoScreen";

import TopTabNavigator from "./navigation/TopTabNavigator";
import { Button, View } from "react-native"; // Dùng để debug


const authStack = createStackNavigator();
const mainStack = createStackNavigator();

const AuthStack = () => {
  return (
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
      <authStack.Screen
        name="Register_Step4_Email"
        component={RegisterScreen_Step4_Email}
        options={{
          headerShown: false,
        }}
      />
      <authStack.Screen
        name="Register_Step4_Phone"
        component={RegisterScreen_Step4_Phone}
        options={{
          headerShown: false,
        }}
      />
      <authStack.Screen
        name="Register_Step5"
        component={RegisterScreen_Step5}
        options={{
          headerShown: false,
        }}
      />
      <authStack.Screen
        name="Register_Step6"
        component={RegisterScreen_Step6}
        options={{
          headerShown: false,
        }}
      />
      <authStack.Screen
        name="VerifyScreen"
        component={VerifyScreen}
        options={{
          headerShown: false,
        }}
      />
    </authStack.Navigator>

  );
};

const MainStack = () => {
  return (
    <mainStack.Navigator screenOptions={{ headerShown: false }}>
      <mainStack.Screen name="Home" component={HomeScreen} />
      <mainStack.Screen name="Post" component={PostScreen} />
      <mainStack.Screen name="Video" component={VideoScreen} />
      <mainStack.Screen name="Profile" component={ProfileScreen} />
    </mainStack.Navigator>
  );
};


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
      {/* Dùng để debug*/}
      
      <View style={{ position: 'absolute', bottom: 50, right: 20 }}>
        <Button title="Set Authenticated" onPress={() => setIsAuthenticated(!isAuthenticated)} />
      </View>
    </NavigationContainer>
  )
}
