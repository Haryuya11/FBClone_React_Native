import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { UserContext } from "../../context/UserContext";
import * as friendshipService from "../../services/friendshipService";

const ChatMenuScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const { userProfile } = useContext(UserContext);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const friendsList = await friendshipService.getFriendsList(userProfile.id);
      setFriends(friendsList);
    } catch (error) {
      console.error("Lỗi khi tải danh sách chat:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('DirectMessage', { 
        user: {
          id: item.id,
          name: `${item.first_name} ${item.last_name}`,
          avatar: item.avatar_url
        }
      })}
    >
      <Image 
        source={{ uri: item?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png' }} 
        style={styles.avatar} 
      />
      <Text style={styles.userName}>{`${item.first_name} ${item.last_name}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 16,
  },
});

export default ChatMenuScreen;
