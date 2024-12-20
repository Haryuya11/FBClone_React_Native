import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import HeaderNavigationComponent from "../../Components/HeaderNavigationComponent";
import Entypo from "@expo/vector-icons/Entypo";
import Home from "../../assets/svg/home_outline.svg";
import Post from "../../assets/svg/post_outline.svg";
import Video from "../../assets/svg/video_outline.svg";
import { UserContext } from "../../context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import PostComponent from "../../Components/PostComponent";
import PostCreationComponent from "../../Components/PostCreationComponent";
import * as postService from "../../services/postService";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as userService from "../../services/userService";
// Chiều cao của Header

const friends = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    avatar:
      "https://img.freepik.com/photos-premium/planete-montagnes-planetes-arriere-plan_746764-103.jpg",
  },
  {
    id: "2",
    name: "Trần Thị B",
    avatar:
      "https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg",
  },
  {
    id: "3",
    name: "Lê Văn C",
    avatar:
      "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
  },
  {
    id: "4",
    name: "Phạm Văn D",
    avatar:
      "https://img.freepik.com/photos-premium/image-planete-lune-etoiles_469760-4288.jpg",
  },
  {
    id: "5",
    name: "Hoàng Thị E",
    avatar:
      "https://cdn.pixabay.com/photo/2023/03/15/20/46/background-7855413_640.jpg",
  },
  {
    id: "6",
    name: "Vũ Văn F",
    avatar:
      "https://img.freepik.com/photos-premium/homme-regarde-planete-montagnes-au-sommet_7023-8807.jpg",
  },
];

const ProfileScreen = ({ route, navigation }) => {
  const { userProfile, logout, refreshProfile, imageCache } =
    useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userId = route.params?.userId || userProfile?.id;
  const isOwnProfile = userId === userProfile?.id;
  
  const loadProfile = async () => {
    try {
      if (userId) {
        const [profileData, postsData] = await Promise.all([
          userService.loadUserProfile(userId),
          postService.getPostsByUserId(userId)
        ]);
        
        if (profileData && postsData) {
          setProfile(profileData);
          const postsWithProfiles = postsData.map(post => ({
            ...post,
            profiles: profileData
          }));
          setPosts(postsWithProfiles);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  useEffect(() => {
    if (!userId || !profile) return;
    
    const subscription = postService.subscribeToUserPosts(userId, async (payload) => {
      try {
        if (payload.eventType === 'INSERT') {
          setPosts(prev => [{...payload.new, profiles: profile}, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setPosts(prev => prev.filter(post => post.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setPosts(prev => prev.map(post =>
            post.id === payload.new.id ? {...payload.new, profiles: profile} : post
          ));
        }
      } catch (error) {
        console.error("Error handling realtime update:", error);
      }
    });

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [userId, profile]);

  const handleAddFriend = async () => {
    alert("Tính năng đang phát triển");
  };

  const handleMessage = () => {
    navigation.navigate("DirectMessage", { user: profile });
  };

  // Render buttons dựa vào isOwnProfile
  const renderActionButtons = () => {
    if (userId === userProfile?.id) {
      return (
        <View style={styles.midContent}>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <FontAwesome name="pencil" size={20} color="black" />
            <Text style={styles.textEditProfileBtn}>
              Chỉnh sửa trang cá nhân
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="black" />
            <Text style={styles.textSettingBtn}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.midContent}>
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={handleAddFriend}
        >
          <AntDesign name="adduser" size={20} color="black" />
          <Text style={styles.textEditProfileBtn}>Kết bạn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingBtn} onPress={handleMessage}>
          <AntDesign name="message1" size={20} color="black" />
          <Text style={styles.textSettingBtn}>Nhắn tin</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProfile();
    setIsRefreshing(false);
  };

  const handleButtonPress = (name) => {
    console.log(name);
    navigation.navigate(name);
    // Console log Navigation
  };

  const [selectedButton, setSelectedButton] = useState("Profile"); // State trang hiện tại

  // Biểu tượng điều hướng
  const navigationButtons = [
    { name: "Home", label: <Home width={35} height={35} /> },
    { name: "Post", label: <Post width={35} height={35} /> },
    { name: "Video", label: <Video width={35} height={35} /> },
    {
      name: "Profile",
      label: (
        <Image
          source={{ uri: userProfile.avatar_url }}
          style={styles.profileIcon}
        />
      ),
    },
  ];

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity style={styles.friendItem}>
      <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
      <Text style={styles.friendName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Hàm xử lý khi bài viết mới được đăng
  const handlePostSubmit = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Thêm bài mới vào đầu danh sách
  };

  if (isLoading || !profile) {
    return <ActivityIndicator size="large" color="#316ff6" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Post List */}
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostComponent post={item} onRefresh={handleRefresh} />
        )}
        keyExtractor={(item) => item.id}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.headerContainer}>
              {/* Header Navigation Component */}
              <HeaderNavigationComponent
                navigationButtons={navigationButtons}
                onButtonPress={handleButtonPress}
                selectedButton={selectedButton}
              />
            </View>
            {/* Header */}
            <View style={styles.topContent}>
              <Image
                style={styles.backgroundImageProfile}
                source={{
                  uri:
                    profile?.background_image ||
                    userProfile?.background_image ||
                    "default_background_url",
                }}
              />
              <View style={styles.avatarBox}>
                <View style={styles.avatarContainer}>
                  <View style={styles.borderAvatar}>
                    <Image
                      style={styles.avatar}
                      source={{
                        uri:
                          profile?.avatar_url ||
                          userProfile?.avatar_url ||
                          "default_avatar_url",
                      }}
                    />
                  </View>
                </View>
                <Text style={styles.userNameAvatarBox}>
                  {profile
                    ? `${profile.first_name} ${profile.last_name}`
                    : "Loading..."}
                </Text>
                <Text style={styles.numberOfFriends}>100 người bạn</Text>
              </View>
            </View>
            {renderActionButtons()}
            <View style={styles.botContent}>
              <View style={styles.postBtnContainer}>
                <TouchableOpacity>
                  <Text style={styles.postBtn}>Bài viết</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.postBtn}>Ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.postBtn}>Video</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.detail}>Chi tiết</Text>
              <View style={styles.detailContainer}>
                <Text>Thông tin người dùng</Text>
                <TouchableOpacity>
                  <Text>Xem thông tin giới thiệu của bạn</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.friendContainer}>
                {/* Tiêu đề danh sách bạn bè */}
                <View style={styles.friendHeader}>
                  <Text style={styles.friendTitle}>Bạn bè</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("FriendList")}
                  >
                    <Text style={styles.friendSeeAll}>Xem tất cả</Text>
                  </TouchableOpacity>
                </View>

                {/* Danh sách bạn bè dạng lưới */}
                <FlatList
                  data={friends}
                  renderItem={renderFriendItem}
                  keyExtractor={(item) => item.id}
                  numColumns={3} // Hiển thị lưới với 3 cột
                  scrollEnabled={false} // Không cuộn trong danh sách bạn bè (để giữ gọn)
                  contentContainerStyle={styles.friendList}
                />
              </View>
              {isOwnProfile && (
                <PostCreationComponent
                  onPostSubmit={handlePostSubmit}
                  navigation={navigation}
                />
              )}
            </View>
          </>
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  topContent: {
    marginBottom: 160,
  },
  avatarContainer: {
    height: 200,
    width: 200,
    backgroundColor: "white",
    borderRadius: 200,
    borderWidth: 0.6,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  borderAvatar: {
    height: "100%",
    width: "100%",
    borderRadius: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    height: "100%",
    width: "100%",
    borderRadius: 200,
  },
  userNameAvatarBox: {
    fontSize: 20,
    fontWeight: "bold",
  },
  numberOfFriends: {
    fontStyle: "italic",
  },
  midContent: {
    marginBottom: 10,
    flex: 1,
    paddingHorizontal: 20,
    borderBottomWidth: 15,
    borderColor: "#CACED0",
    paddingBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 0.5,
    paddingVertical: 10,
    paddingRight: 18,
    borderColor: "gray",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    width: "65%",
  },
  textEditProfileBtn: {
    fontSize: 17,
    marginLeft: 10,
  },
  settingBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 0.5,
    paddingVertical: 10,
    paddingRight: 18,
    borderColor: "gray",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    width: "30%",
  },
  textSettingBtn: {
    fontSize: 17,
    marginLeft: 10,
  },
  botContent: {},
  postBtnContainer: {
    flexDirection: "row",
    paddingLeft: 20,
    gap: 10,
    textAlign: "center",
    justifyContent: "flex-start",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    paddingBottom: 20,
  },
  postBtn: {
    borderColor: "#CCC",
    borderWidth: 0.5,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#EBF5FD",
    color: "gray",
    fontWeight: "500",
  },
  detail: {
    marginTop: 20,
    fontSize: 25,
    paddingLeft: 20,
    fontWeight: "bold",
  },
  detailContainer: {
    paddingLeft: 20,
    marginBottom: 20,
    padding: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  friendContainer: {
    paddingHorizontal: 20,
    borderBottomWidth: 15,
    borderColor: "#CACED0",
    paddingBottom: 20,
  },
  friendTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  friendSeeAll: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 14,
  },
  friendList: {
    alignItems: "center",
  },
  friendItem: {
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  friendAvatar: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginBottom: 5,
  },
  friendName: {
    fontSize: 14,
    textAlign: "center",
    maxWidth: 80, // Giới hạn chiều rộng tên
  },
  postBox: {
    borderBottomWidth: 15,
    borderColor: "#CACED0",
    padding: 20,
  },
  postBoxBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  avatarContainerPost: {
    height: 70,
    width: 70,
    backgroundColor: "white",
    borderRadius: 200,
    borderWidth: 0.6,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  borderAvatarPost: {
    height: "100%",
    width: "100%",
    borderRadius: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPost: {
    height: "100%",
    width: "100%",
  },
  post: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarInPost: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flexDirection: "column",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  time: {
    color: "#888",
    fontSize: 12,
  },
  content: {
    marginVertical: 10,
    fontSize: 14,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginInline: -15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  actionText: {
    fontSize: 14,
    color: "black",
    marginLeft: 5,
  },
  backgroundImageProfile: {
    width: "100%",
    height: 300,
  },
  avatarBox: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: 250,
    width: 200,
    marginTop: 200,
    marginLeft: 10,
  },
  profileIcon: {
    height: 35,
    width: 35,
    borderRadius: 25,
    resizeMode: "cover",
    borderWidth: 3,
    borderColor: "#316ff6",
  },
});

export default ProfileScreen;
