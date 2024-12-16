import React, {
  useState,
  useContext,
  useCallback,
} from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import HeaderNavigationComponent from "../../Components/HeaderNavigationComponent";
import Entypo from "@expo/vector-icons/Entypo";
import Home from '../../assets/svg/home_outline.svg'
import Post from '../../assets/svg/post_outline.svg'
import Video from '../../assets/svg/video_outline.svg'
import { UserContext } from "../../context/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import PostComponent from '../../Components/PostComponent';
import PostCreationComponent from '../../Components/PostCreationComponent';

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

const ProfileScreen = ({ navigation }) => {
  // Temp post để làm mẫu
  const [posts, setPosts] = useState([
    {
      id: '1',
      user: 'Nguyễn Tấn Cầm',
      content: 'de nhat tien si!',
      image: 'https://inseclab.uit.edu.vn/upload/2018/04/mrCam.png',
      avatar: 'https://nc.uit.edu.vn/wp-content/uploads/2022/11/80299-NguyenTanCam-Cam-Nguyen-Tan-272x300.jpg',
      time: '2 giờ trước',
      like: 9,
      comment: 0,
      share: 0,
      isLike: false,
    }
  ]);


  const { userProfile, logout, refreshProfile, imageCache } = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      alert("Đăng xuất thất bại: " + error.message);
    }
  };

  const handleButtonPress = (name) => {
    console.log(name);
    navigation.navigate(name);
    // Console log Navigation
  };

  const [selectedButton, setSelectedButton] = useState('Profile'); // State trang hiện tại

  // Biểu tượng điều hướng
  const navigationButtons = [
    { name: 'Home', label: <Home width={35} height={35} /> },
    { name: 'Post', label: <Post width={35} height={35} /> },
    { name: 'Video', label: <Video width={35} height={35} /> },
    { name: 'Profile', label: <Image source={{ uri: userProfile.avatar_url }} style={styles.profileIcon} /> },
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

  return (
    <View style={{ flex: 1 }}>
      {/* Post List */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostComponent post={item} setPosts={setPosts} />}
        keyExtractor={(item) => item.id}
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
                  uri: imageCache.background || userProfile?.background_image || "default_background_url"
                }}
              />
              <View style={styles.avatarBox}>
                <View style={styles.avatarContainer}>
                  <View style={styles.borderAvatar}>
                    <Image
                      style={styles.avatar}
                      source={{
                        uri: imageCache.avatar || userProfile?.avatar_url || "default_avatar_url"
                      }}
                    />
                  </View>
                </View>
                <Text style={styles.userNameAvatarBox}>
                  {userProfile?.first_name || ""} {userProfile?.last_name || ""}
                </Text>
                <Text style={styles.numberOfFriends}>100 người bạn</Text>
              </View>
            </View>
            <View style={styles.midContent}>
              <TouchableOpacity
                style={styles.editProfileBtn}
                onPress={() => navigation.navigate("EditProfile")}
              >
                <Entypo name="edit" size={24} color="black" />
                <Text style={styles.textEditProfileBtn}>
                  Chỉnh sửa thông tin cá nhân
                </Text>
              </TouchableOpacity>
            </View>
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
              <PostCreationComponent onPostSubmit={handlePostSubmit} />
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
  },
  textEditProfileBtn: {
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
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#316ff6',
  }
});

export default ProfileScreen;
