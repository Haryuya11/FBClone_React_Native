import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const friends = [
  { id: '1', name: 'Nguyễn Văn A', avatar: 'https://img.freepik.com/photos-premium/planete-montagnes-planetes-arriere-plan_746764-103.jpg' },
  { id: '2', name: 'Trần Thị B', avatar: 'https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg' },
  { id: '3', name: 'Lê Văn C', avatar: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg' },
  { id: '4', name: 'Phạm Văn D', avatar: 'https://img.freepik.com/photos-premium/image-planete-lune-etoiles_469760-4288.jpg' },
  { id: '5', name: 'Hoàng Thị E', avatar: 'https://cdn.pixabay.com/photo/2023/03/15/20/46/background-7855413_640.jpg' },
  { id: '6', name: 'Vũ Văn F', avatar: 'https://img.freepik.com/photos-premium/homme-regarde-planete-montagnes-au-sommet_7023-8807.jpg' },
];

const FriendListScreen = ({ navigation }) => {
  const renderFriendItem = ({ item }) => (
    <TouchableOpacity style={styles.friendItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.friendName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Bạn bè</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm bạn bè..."
      />

      {/* Friend List */}
      <FlatList
        data={friends}
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
});

export default FriendListScreen;
