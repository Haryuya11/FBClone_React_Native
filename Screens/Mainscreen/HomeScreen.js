import React, { useRef, useState, useContext } from 'react';
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
} from 'react-native';
import HeaderNavigationComponent from '../../Components/HeaderNavigationComponent';
import Home from '../../assets/svg/home_blue.svg'
import Post from '../../assets/svg/post_outline.svg'
import Video from '../../assets/svg/video_outline.svg'
import Search from '../../assets/svg/search.svg'
import Chat from '../../assets/svg/chat.svg'
import PostComponent from '../../Components/PostComponent';
import PostCreationComponent from '../../Components/PostCreationComponent';
import { UserContext } from "../../context/UserContext";

// Chiều cao của Header
const HEADER_HEIGHT = 100;

const HomeScreen = ({ navigation }) => {
  const { userProfile } = useContext(UserContext);

  // Temp post để làm mẫu
  const [posts, setPosts] = useState([
    {
      id: '1',
      user: 'Nguyễn Tấn Cầm',
      content: 'de nhat tien si!\n toi la ng tan cam \n sadas \n dasdsa\n dasdad\nssadsada',
      image: 'https://inseclab.uit.edu.vn/upload/2018/04/mrCam.png',
      avatar: 'https://nc.uit.edu.vn/wp-content/uploads/2022/11/80299-NguyenTanCam-Cam-Nguyen-Tan-272x300.jpg',
      time: '2 giờ trước',
      like: 9,
      comment: 0,
      share: 0,
      isLike: false,
    },
    {
      id: '2',
      user: 'Mr.Mewing',
      content: '50 years challenge!',
      image: 'https://i.ytimg.com/vi/Hlf18AIRg8Y/mqdefault.jpg',
      avatar: 'https://steamuserimages-a.akamaihd.net/ugc/2494510408099943078/F01916FFB56B797146821623A1E2811C03229A66/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
      time: '2 giờ trước',
      like: 6969,
      comment: 666,
      share: 1945,
      isLike: false,
    },
    {
      id: '3',
      user: 'Yi Long Ma',
      content: 'This is my new Tesla',
      image: 'https://www.mundodeportivo.com/files/image_449_220/files/fp/uploads/2021/12/17/61bd03fcb8ed6.r_d.493-271-5908.png',
      avatar: 'https://i1.sndcdn.com/avatars-XpzN0ujJa3iI96PS-hKizHQ-t1080x1080.jpg',
      time: '1 ngày trước',
      like: 30,
      comment: 0,
      share: 11,
      isLike: false,
    },
    {
      id: '4',
      user: 'Phạm Thế Sơn',
      content: 'Tôi yêu codeblock!',
      image: 'https://o.rada.vn/data/image/2020/09/15/codeblock-error.png',
      avatar: 'https://o.rada.vn/data/image/2020/09/15/codeblock-error.png',
      time: '1 ngày trước',
      like: 0,
      comment: 2,
      share: 1,
      isLike: false,
    },
  ]);

  const [selectedButton, setSelectedButton] = useState('Home'); // State trang hiện tại

  const translateY = useRef(new Animated.Value(0)).current; // Animated value cho header
  const [previousScroll, setPreviousScroll] = useState(0);

  const animateHeader = (toValue) => {
    Animated.timing(translateY, {
      toValue,
      duration: 300, // 0.3s
      easing: Easing.out(Easing.quad), // Làm smooth
      useNativeDriver: true, // Dùng Native driver để tăng hiệu suất
    }).start();
  };

  const handleScroll = (event) => {
    const currentScroll = event.nativeEvent.contentOffset.y;

    if (currentScroll > previousScroll && currentScroll > 200) {
      // Cuộn xuống, ẩn header
      animateHeader(-HEADER_HEIGHT);
    } else if (currentScroll < previousScroll) {
      // Cuộn lên, hiện header
      animateHeader(0);
    }

    setPreviousScroll(currentScroll);
  };

  const handleButtonPress = (name) => {
    console.log(name);
    navigation.navigate(name);
    // Console log Navigation
  };

  // Biểu tượng trên Navigation
  const navigationButtons = [
    { name: 'Home', label: <Home width={35} height={35} /> },
    { name: 'Post', label: <Post width={35} height={35} /> },
    { name: 'Video', label: <Video width={35} height={35} /> },
    { name: 'Profile', label: <Image source={{ uri: userProfile.avatar_url }} style={styles.profileIcon} /> },
  ];

  // Hàm xử lý khi bài viết mới được đăng
  const handlePostSubmit = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Thêm bài mới vào đầu danh sách
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header Animated */}
      <Animated.View
        style={[
          styles.headerContainer,
          { transform: [{ translateY }] },
        ]}
      >
        <View style={styles.headerTop}>
          <Text style={styles.appName}>Facenote</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Search width={35} height={35} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Chat width={35} height={35} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Header Navigation Component */}
        <HeaderNavigationComponent
          navigationButtons={navigationButtons}
          onButtonPress={handleButtonPress}
          selectedButton={selectedButton}
        />
      </Animated.View>

      {/* Post List */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostComponent post={item} setPosts={setPosts} />}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        // Component tạo bài viết 
        ListHeaderComponent={
          <View style={styles.newPost}>
            <PostCreationComponent onPostSubmit={handlePostSubmit} navigation={navigation} />
          </View>
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
    paddingHorizontal: 10,
    height: HEADER_HEIGHT,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'blue',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
  },
  headerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  newPost: {
    paddingTop: 105,
  },
  profileIcon: {
    height: 35,
    width: 35,
    borderRadius: 25,
    resizeMode: 'cover',
  }
});

export default HomeScreen;
