import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { UserContext } from "../../context/UserContext";
import * as friendshipService from "../../services/friendshipService";
import AntDesign from "@expo/vector-icons/AntDesign";

const FriendListScreen = ({ navigation, route }) => {
  const { userProfile } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = route.params?.userId || userProfile?.id;
  const isOwnProfile = userId === userProfile?.id;

  useEffect(() => {
    loadFriends();
  }, [userId]);

  const loadFriends = async () => {
    try {
      const friendsList = await friendshipService.getFriendsList(userId);
      setFriends(friendsList);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bạn bè:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFriendAction = async (friendId) => {
    try {
      const isFriend = await friendshipService.checkFriendship(friendId);
      if (isFriend) {
        await friendshipService.removeFriend(friendId);
      } else {
        await friendshipService.addFriend(friendId);
      }
      loadFriends(); // Tải lại danh sách bạn bè
    } catch (error) {
      console.error("Lỗi khi thực hiện hành động bạn bè:", error);
    }
  };

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.friendItem}
      onPress={() => {
        alert("Đang bị lỗi");
        navigation.navigate("Profile", { userId: item.id });
      }}
    >
      <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName} numberOfLines={1}>
          {`${item.first_name} ${item.last_name}`}
        </Text>
        {!isOwnProfile && item.id !== userProfile?.id && (
          <FriendButton 
            userId={item.id}
            style={styles.friendActionButton}
            onFriendshipChange={loadFriends}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const filteredFriends = friends.filter(friend => 
    `${friend.first_name} ${friend.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#316ff6" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Bạn bè ({friends.length})</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm bạn bè..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredFriends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.friendList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    paddingTop: 10,
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  friendList: {
    justifyContent: 'space-between',
  },
  friendItem: {
    flexDirection: 'row', // Xếp hàng ngang (hình ảnh + tên)
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 1, // Hiệu ứng đổ bóng nhẹ
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  friendName: {
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 20
  },
  friendInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
  },
  friendActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 20,
  },
  friendActionText: {
    marginLeft: 5,
    color: 'red',
    fontSize: 14,
  },
});

export default FriendListScreen;
