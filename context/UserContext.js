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
  const [imageCache, setImageCache] = useState({
    avatar: null,
    background: null,
  });

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
      const { user: authUser, profile } = await userService.signIn(
        email,
        password
      );
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
    setIsLoading(true);
    try {
      const updatedProfile = await userService.updateProfile(user.id, userData);
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem(
        "user_profile",
        JSON.stringify(updatedProfile)
      );
      setIsLoading(false);
      return updatedProfile;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
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
  };

  const updateProfile = async (updateData) => {
    try {
      setIsLoading(true);
      const updatedProfile = await userService.updateProfile(
        user.id,
        updateData
      );

      // Cập nhật userProfile ngay sau khi có dữ liệu mới
      setUserProfile(updatedProfile);

      // Cập nhật AsyncStorage
      await AsyncStorage.setItem(
        "user_profile",
        JSON.stringify(updatedProfile)
      );

      setIsLoading(false);
      return updatedProfile;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const getImageUrlWithTimestamp = (url) => {
    if (!url) return null;
    return `${url}?t=${new Date().getTime()}`;
  };

  const refreshProfile = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      const profileWithTimestamp = {
        ...data,
        avatar_url: getImageUrlWithTimestamp(data.avatar_url),
        background_image: getImageUrlWithTimestamp(data.background_image),
      };

      setUserProfile(profileWithTimestamp);
      await AsyncStorage.setItem(
        "user_profile",
        JSON.stringify(profileWithTimestamp)
      );
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  const updateImageCache = (avatarUrl, backgroundUrl) => {
    setImageCache({
      avatar: avatarUrl,
      background: backgroundUrl,
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userProfile,
        isAuthenticated,
        isLoading,
        refreshProfile,
        login: handleLogin,
        register: handleRegister,
        updateProfile: handleUpdateProfile,
        logout: handleLogout,
        updateImageCache,
        imageCache,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
