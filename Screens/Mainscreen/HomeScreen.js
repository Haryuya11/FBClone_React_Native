import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import HeaderNavigationComponent from '../../Components/HeaderNavigationComponent';
import Home from '../../assets/svg/home_blue.svg'
import Post from '../../assets/svg/post_outline.svg'
import Video from '../../assets/svg/video_outline.svg'
import Profile from '../../assets/svg/profile_outline.svg'
import Search from '../../assets/svg/search.svg'
import Chat from '../../assets/svg/chat.svg'
import LikeReaction from '../../assets/svg/like_reaction.svg'

// Chiều cao của Header
const HEADER_HEIGHT = 100;

// Temp post để làm mẫu
const posts = [
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
  },
];

const HomeScreen = ({ navigation }) => {
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
    { name: 'Home', label: <Home width={50} height={50} /> },
    { name: 'Post', label: <Post width={50} height={50} /> },
    { name: 'Video', label: <Video width={50} height={50} /> },
    { name: 'Profile', label: <Profile width={50} height={50} /> },
  ];

  // Làm basic tạm thời
  const renderPost = ({ item }) => (
    <View style={styles.post}>
      <View style={styles.header}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.username}>{item.user}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>

      <Text style={styles.content}>{item.content}</Text>

      <Image source={{ uri: item.image }} style={styles.postImage} />
      {(item.like > 0 || item.comment > 0 || item.share > 0) && (
        <View style={styles.reaction}>
          {item.like > 0 && (
            <View style={styles.reactionLike}>
              <LikeReaction />
              <Text>{item.like}</Text>
            </View>
          )}
          {item.comment > 0 && (
            <Text> {item.comment} bình luận</Text>
          )}
          {item.share > 0 && (
            <Text style={styles.reactionComment}> {item.share} lượt chia sẻ</Text>
          )}
        </View>
      )}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <AntDesign name="like2" size={24} color="black" />
          <Text style={styles.actionText}>Thích</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="comment-o" size={24} color="black" />
          <Text style={styles.actionText}>Bình luận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <SimpleLineIcons name="share" size={24} color="black" />
          <Text style={styles.actionText}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
        onScroll={handleScroll}
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
  post: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
  content: {
    marginVertical: 10,
    fontSize: 14,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  reaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
    height: 25,
  },
  reactionComment: {
    marginInlineStart: -85,
  },
  reactionLike: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginInline: -10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    fontSize: 14,
    color: 'black',
    marginLeft: 5,
  },
});

export default HomeScreen;
