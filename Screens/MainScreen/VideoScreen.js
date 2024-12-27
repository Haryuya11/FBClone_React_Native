import React, { useState, useContext, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import HeaderNavigationComponent from "../../Components/HeaderNavigationComponent";
import Home from "../../assets/svg/home_outline.svg";
import Post from "../../assets/svg/post_outline.svg";
import Video from "../../assets/svg/video_blue.svg";
import PostDark from '../../assets/svg/darkmode/post_outline.svg';
import HomeDark from '../../assets/svg/darkmode/home_outline.svg';
import VideoDark from '../../assets/svg/darkmode/video_outline.svg';
import { UserContext } from "../../context/UserContext";
import * as postService from "../../services/postService";
import PostComponent from "../../Components/PostComponent";

const HEADER_HEIGHT = 55;

const VideoScreen = ({ navigation }) => {
  const { userProfile, isDarkMode, language } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPosts = async () => {
    try {
      const postsData = await postService.getPostsByMediaType("video");
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPosts();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const [selectedButton, setSelectedButton] = useState("Video");
  const handleButtonPress = (name) => {
    console.log(name);
    navigation.navigate(name);
  };

  const navigationButtons = [
    { name: "Home", label: isDarkMode ? <HomeDark width={35} height={35} /> : <Home width={35} height={35} /> },
    { name: "Post", label: isDarkMode ? <PostDark width={35} height={35} /> : <Post width={35} height={35} /> },
    { name: "Video", label: isDarkMode ? <VideoDark width={35} height={35} /> : <Video width={35} height={35} /> },
    {
      name: "Profile",
      label: (
        <Image
          source={{
            uri: userProfile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
          }}
          style={styles(isDarkMode).profileIcon}
        />
      ),
    },
  ];

  return (
    <View style={styles(isDarkMode).container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles(isDarkMode).headerContainer}>
        <HeaderNavigationComponent
          navigationButtons={navigationButtons}
          onButtonPress={handleButtonPress}
          selectedButton={selectedButton}
        />
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostComponent post={item} onRefresh={handleRefresh} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

// Dynamic styles based on dark mode
const styles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#000" : "#fff",
    },
    headerContainer: {
      backgroundColor: isDarkMode ? "#27262b" : "#fff",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    },
    post: {
      backgroundColor: isDarkMode ? "#333" : "#fff",
      marginBottom: 10,
      padding: 10,
      borderRadius: 10,
      shadowColor: isDarkMode ? "#444" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
    },
    profileIcon: {
      height: 35,
      width: 35,
      borderRadius: 25,
      resizeMode: "cover",
    },
  });

export default VideoScreen;
