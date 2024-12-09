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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HeaderNavigationComponent from '../../Components/HeaderNavigationComponent';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

// Chiều cao của Header
const HEADER_HEIGHT = 100;

const posts = [
  {
    id: '1',
    user: 'Nguyễn Tấn Cầm',
    content: 'de nhat tien si!',
    image: 'https://inseclab.uit.edu.vn/upload/2018/04/mrCam.png',
    avatar: 'https://nc.uit.edu.vn/wp-content/uploads/2022/11/80299-NguyenTanCam-Cam-Nguyen-Tan-272x300.jpg',
    time: '2 giờ trước',
  },
  {
    id: '2',
    user: 'Nguyễn Tấn Cầm',
    content: 'de nhat tien si!',
    image: 'https://inseclab.uit.edu.vn/upload/2018/04/mrCam.png',
    avatar: 'https://nc.uit.edu.vn/wp-content/uploads/2022/11/80299-NguyenTanCam-Cam-Nguyen-Tan-272x300.jpg',
    time: '2 giờ trước',
  },
  {
    id: '3',
    user: 'Phạm Thế Sơn',
    content: 'codeblock!',
    image: 'https://o.rada.vn/data/image/2020/09/15/codeblock-error.png',
    avatar: 'https://o.rada.vn/data/image/2020/09/15/codeblock-error.png',
    time: '1 ngày trước',
  },
  {
    id: '4',
    user: 'Phạm Thế Sơn',
    content: 'codeblock!',
    image: 'https://o.rada.vn/data/image/2020/09/15/codeblock-error.png',
    avatar: 'https://o.rada.vn/data/image/2020/09/15/codeblock-error.png',
    time: '1 ngày trước',
  },
];
const HomeScreen = ({navigation}) => {
  const [selectedButton, setSelectedButton] = useState('Home'); 
  const translateY = useRef(new Animated.Value(0)).current; // Animated value for header
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
    { name: 'Home', label: <Entypo name="home" size={35} color="blue" /> },
    { name: 'Post', label: <MaterialCommunityIcons name="post-outline" size={35} color="black" /> },
    { name: 'Video', label: <Ionicons name="videocam-outline" size={37} color="black" /> },
    { name: 'Profile', label: 'Profile' },
  ];

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
              <AntDesign name="search1" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="chat-bubble-outline" size={24} color="black" />
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
    gap: 15,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginInline: -15,
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
