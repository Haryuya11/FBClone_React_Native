import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HeaderNavigationComponent from "../../Components/HeaderNavigationComponent";
import { ScrollView } from "react-native-gesture-handler";
import Entypo from "@expo/vector-icons/Entypo";
// Chiều cao của Header
const HEADER_HEIGHT = 0;

const posts = [
  {
    id: "1",
    user: "Nguyễn Tấn Cầm",
    content: "de nhat tien si!",
    image: "https://inseclab.uit.edu.vn/upload/2018/04/mrCam.png",
    avatarInPost:
      "https://nc.uit.edu.vn/wp-content/uploads/2022/11/80299-NguyenTanCam-Cam-Nguyen-Tan-272x300.jpg",
    time: "2 giờ trước",
  },
  {
    id: "2",
    user: "Nguyễn Tấn Cầm",
    content: "de nhat tien si!",
    image: "https://inseclab.uit.edu.vn/upload/2018/04/mrCam.png",
    avatarInPost:
      "https://nc.uit.edu.vn/wp-content/uploads/2022/11/80299-NguyenTanCam-Cam-Nguyen-Tan-272x300.jpg",
    time: "2 giờ trước",
  },
  {
    id: "3",
    user: "Phạm Thế Sơn",
    content: "codeblock!",
    image: "https://o.rada.vn/data/image/2020/09/15/codeblock-error.png",
    avatarInPost: "https://o.rada.vn/data/image/2020/09/15/codeblock-error.png",
    time: "1 ngày trước",
  },
  {
    id: "4",
    user: "Phạm Thế Sơn",
    content: "codeblock!",
    image: "https://o.rada.vn/data/image/2020/09/15/codeblock-error.png",
    avatarInPost: "https://o.rada.vn/data/image/2020/09/15/codeblock-error.png",
    time: "1 ngày trước",
  },
];
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
  const handleButtonPress = (name) => {
    console.log(name);
    navigation.navigate(name);
    // Console log Navigation
  };

  // Cần thay thế label bằng biểu tượng
  const navigationButtons = [
    { name: "Home", label: "Home" },
    { name: "Post", label: "Post" },
    { name: "Video", label: "Video" },
    { name: "Profile", label: "Profile" },
  ];

  const renderPost = ({ item }) => (
    <View style={styles.post}>
      <View style={styles.header}>
        <Image
          source={{ uri: item.avatarInPost }}
          style={styles.avatarInPost}
        />
        <View style={styles.headerText}>
          <Text style={styles.username}>{item.user}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>

      <Text style={styles.content}>{item.content}</Text>

      <Image source={{ uri: item.image }} style={styles.postImage} />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <AntDesign name="like2" size={24} color="black" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="comment-o" size={24} color="black" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <SimpleLineIcons name="share" size={24} color="black" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderFriendItem = ({ item }) => (
    <TouchableOpacity style={styles.friendItem}>
      <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
      <Text style={styles.friendName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={{ flex: 1 }}>
      {/* Post List */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
        ListHeaderComponent={
          <>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.headerContainer}>
              {/* Header Navigation Component */}
              <HeaderNavigationComponent
                navigationButtons={navigationButtons}
                onButtonPress={handleButtonPress}
              />
            </View>
            {/* Header */}
            <View style={styles.topContent}>
              <Image
                style={styles.backgroundImageProfile}
                source={{
                  uri: "https://t4.ftcdn.net/jpg/07/69/40/97/360_F_769409709_PjhFP5bP2AZVJinAEE4tAVKNkQVhQMpH.jpg",
                }}
              />
              <View style={styles.avatarBox}>
                <View style={styles.avatarContainer}>
                  <View style={styles.borderAvatar}>
                    <Image
                      style={styles.avatar}
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
                      }}
                    />
                  </View>
                </View>
                <Text style={styles.userNameAvatarBox}>Tên người dùng</Text>
                <Text style={styles.numberOfFriends}>100 người bạn</Text>
              </View>
            </View>
            <View style={styles.midContent}>
              <TouchableOpacity style={styles.editProfileBtn}>
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
                  <TouchableOpacity>
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
              <View style={styles.postBox}>
                <Text style={{ fontSize: 20 }}>Bài viết</Text>
                <View style={styles.postBoxBtn}>
                  <View style={styles.avatarContainerPost}>
                    <View style={styles.borderAvatarPost}>
                      <Image
                        style={styles.avatarPost}
                        source={{
                          uri: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
                        }}
                      />
                    </View>
                  </View>
                  <TouchableOpacity style={{marginLeft: 15}}>
                    <Text style={{fontSize: 18}}>Bạn đang nghĩ gì ?</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  botContent: {
  },
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
});

export default ProfileScreen;
