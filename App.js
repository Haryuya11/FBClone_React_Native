import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState } from "react";
// LoginScreen
import LoginScreen from "./Screens/LoginScreen/LoginScreen";
// RegisterScreen
import RegisterScreen_Step1 from "./Screens/RegisterScreen/RegisterScreen_Step1";
import RegisterScreen_Step2 from "./Screens/RegisterScreen/RegisterScreen_Step2";
import RegisterScreen_Step3 from "./Screens/RegisterScreen/RegisterScreen_Step3";
import RegisterScreen_Step4 from "./Screens/RegisterScreen/RegisterScreen_Step4";
import RegisterScreen_Step5 from "./Screens/RegisterScreen/RegisterScreen_Step5";
import RegisterScreen_Step6 from "./Screens/RegisterScreen/RegisterScreen_Step6";
import RegisterScreen_Step7 from "./Screens/RegisterScreen/RegisterScreen_Step7";
import RegisterScreen_Step8 from "./Screens/RegisterScreen/RegisterScreen_Step8";
import RegisterScreen_Step9 from "./Screens/RegisterScreen/RegisterScreen_Step9";
import RegisterScreen_Step10 from "./Screens/RegisterScreen/RegisterScreen_Step10";
// MainScreen
import HomeScreen from "./Screens/Mainscreen/HomeScreen";
import PostScreen from "./Screens/Mainscreen/PostScreen";
import ProfileScreen from "./Screens/Mainscreen/ProfileScreen";
import VideoScreen from "./Screens/Mainscreen/VideoScreen";

// import TopTabNavigator from "./navigation/TopTabNavigator";
import { Button, View } from "react-native";
import { RegisterProvider } from './context/RegisterContext';

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
        name="Register_Step4"
        component={RegisterScreen_Step4}
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
        name="Register_Step7"
        component={RegisterScreen_Step7}
        options={{
          headerShown: false,
        }}
      />
      <authStack.Screen
        name="Register_Step8"
        component={RegisterScreen_Step8}
        options={{
          headerShown: false,
        }}
      />
      <authStack.Screen
        name="Register_Step9"
        component={RegisterScreen_Step9}
        options={{
          headerShown: false,
        }}
      />
      <authStack.Screen
        name="Register_Step10"
        component={RegisterScreen_Step10}
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

  // Thêm setIsAuthenticated vào global để có thể truy cập từ RegisterScreen_Step10
  global.setIsAuthenticated = setIsAuthenticated;

  return (
    <RegisterProvider>
      <NavigationContainer>
        {isAuthenticated ? <MainStack /> : <AuthStack />}
        {/* Dùng để debug*/}

        <View style={{ position: "absolute", bottom: 50, right: 20 }}>
          <Button
            title="Set Authenticated"
            onPress={() => setIsAuthenticated(!isAuthenticated)}
          />
        </View>
      </NavigationContainer>
    </RegisterProvider>
  );
}
