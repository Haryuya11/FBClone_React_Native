import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, StatusBar  } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import HeaderComponent from '../../Components/HeaderComponent'
import TopTabComponent from '../../navigation/TopTabNavigator'


// Data dùng để debug
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
    user: 'Phạm Thế Sơn',
    content: 'codeblock!',
    image: 'https://o.rada.vn/data/image/2020/09/15/codeblock-error.png',
    avatar: 'https://o.rada.vn/data/image/2020/09/15/codeblock-error.png',
    time: '1 ngày trước',
  },
];

const HomeScreen = () => {
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
      <HeaderComponent/>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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