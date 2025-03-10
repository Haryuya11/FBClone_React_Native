import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { OverlayProvider } from 'stream-chat-expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useContext } from "react";
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
//ProfileScreen
import EditProfileScreen from "./Screens/ProfileScreen/EditProfileScreen";
import FriendListScreen from "./Screens/ProfileScreen/FriendListScreen";
import PostArticlesScreen from "./Screens/ProfileScreen/PostArticlesScreen";
// MainScreen
import HomeScreen from "./Screens/MainScreen/HomeScreen";
import PostScreen from "./Screens/MainScreen/PostScreen";
import ProfileScreen from "./Screens/MainScreen/ProfileScreen";
import VideoScreen from "./Screens/MainScreen/VideoScreen";

// import TopTabNavigator from "./navigation/TopTabNavigator";
import { RegisterProvider } from "./context/RegisterContext";
import { UserContext, UserProvider } from "./context/UserContext";
import { ActivityIndicator } from "react-native";
import DirectMessageScreen from "./Screens/ChatScreen/DirectMessageScreen";
import ChatMenuScreen from "./Screens/ChatScreen/ChatMenuScreen";
import { ChatProvider } from './context/ChatContext';
import SettingScreen from "./Screens/ProfileScreen/SettingScreen";
import FriendRequestScreen from "./Screens/MainScreen/FriendRequestScreen";
import SearchScreen from "./Screens/MainScreen/SearchScreen";

const authStack = createStackNavigator();
const profileStack = createStackNavigator();
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

const ProfileStack = () => {
    return (
        <profileStack.Navigator screenOptions={{ headerShown: false }}>
            <profileStack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                initialParams={{ userId: null }}
            />
            <profileStack.Screen name="FriendList" component={FriendListScreen} />
            <profileStack.Screen name="EditProfile" component={EditProfileScreen} />
            <profileStack.Screen name="PostArticles" component={PostArticlesScreen} />
            <profileStack.Screen name="Setting" component={SettingScreen} />
            
        </profileStack.Navigator>
    );
};

const MainStack = () => {
    return (
        <mainStack.Navigator screenOptions={{ headerShown: false }}>
            <mainStack.Screen name="Home" component={HomeScreen} />
            <mainStack.Screen name="Post" component={PostScreen} />
            <mainStack.Screen name="Video" component={VideoScreen} />
            <mainStack.Screen name="Profile" component={ProfileStack} />
            <mainStack.Screen name="Chat" component={ChatStack} />
            <mainStack.Screen name="FriendRequest" component={FriendRequestScreen} />
            <mainStack.Screen name="Search" component={SearchScreen} />
        </mainStack.Navigator>
    );
};

const ChatStack = () => {
    return (
        <mainStack.Navigator screenOptions={{ headerShown: true }}>
            <mainStack.Screen name="ChatMenu" component={ChatMenuScreen} options={{
                title: 'Message',
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#316ff6',
                headerTitleStyle: {
                    fontWeight: 'bold',
                }
            }} />

            <mainStack.Screen name="DirectMessage" options={{ headerShown: false }} component={DirectMessageScreen} />
        </mainStack.Navigator>
    );
};

const MainApp = () => {
    const { isAuthenticated, isLoading } = useContext(UserContext);

    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    return isAuthenticated ? <MainStack /> : <AuthStack />;
};

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <UserProvider>
                <RegisterProvider>
                    <ChatProvider>
                        <OverlayProvider>
                            <NavigationContainer>
                                <MainApp />
                            </NavigationContainer>
                        </OverlayProvider>
                    </ChatProvider>
                </RegisterProvider>
            </UserProvider>
        </GestureHandlerRootView>
    );
};
