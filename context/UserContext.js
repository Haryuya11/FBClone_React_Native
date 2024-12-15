import React, { createContext, useEffect, useContext, useState } from "react";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as userService from "../services/userService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);

        // Thử lấy profile từ storage
        const storedProfile = await AsyncStorage.getItem("user_profile");
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        } else {
          const profile = await userService.loadUserProfile(session.user.id);
          setUserProfile(profile);
          await AsyncStorage.setItem("user_profile", JSON.stringify(profile));
        }
        setIsAuthenticated(true);
      } else {
        await handleLogout();
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const { user: authUser, profile } = await userService.signIn(email, password);
      setUser(authUser);
      setUserProfile(profile);
      setIsAuthenticated(true);

      await AsyncStorage.setItem("user_profile", JSON.stringify(profile));
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const { user: authUser, profile } = await userService.signUp(userData);
      setUser(authUser);
      setUserProfile(profile);
      setIsAuthenticated(true);

      await AsyncStorage.setItem("user_profile", JSON.stringify(profile));
    } catch (error) {
     throw error; 
    }
  };

  const handleUpdateProfile = async (userData) => {
    try {
      const updatedProfile = await userService.updateProfile(user.id, userData);
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem("user_profile", JSON.stringify(updatedProfile));
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await userService.signOut();
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem("user_profile");
    } catch (error) {
      throw error;
    }
  }

  return (
    <UserContext.Provider
      value={
        {
          user,
          userProfile,
          isAuthenticated,
          isLoading,
          login: handleLogin,
          register: handleRegister,
          updateProfile: handleUpdateProfile,
          logout: handleLogout,
        }
      }
    >
      {children}
    </UserContext.Provider>
  );
};
