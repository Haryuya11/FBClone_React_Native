import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const ChatMenuScreen = ({ navigation }) => {

  const users = [
    { id: '1', name: 'Anh bảy miền tây', avatar: 'https://img.a.transfermarkt.technology/portrait/big/8198-1694609670.jpg?lm=1' },
    { id: '2', name: 'Đỗ Nam Trung', avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/1200px-Donald_Trump_official_portrait.jpg' },
    { id: '3', name: 'Kim Chính Ân', avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Kim_Jong-un_2024.jpg/800px-Kim_Jong-un_2024.jpg' },
  ];

  // Render từng user trong danh sách
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('DirectMessage', { user: item })} 
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.userName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách bạn bè</Text>
      <FlatList
        data={users}
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
