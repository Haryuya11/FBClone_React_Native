import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// Chưa sử dụng, có thể dùng để làm phần tạo bài viết

const HeaderComponent = () => {
  return (
    <View style={styles.header}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiXN9xSEe8unzPBEQOeAKXd9Q55efGHGB9BA&s' }} 
          style={styles.logo} 
        />
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchButton}>
          <AntDesign name="search1" size={18} color="gray" />
          <Text style={styles.searchText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="bell" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="user-circle" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  searchContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  searchText: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 5,
  },
  rightIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  iconButton: {
    padding: 5,
  },
});

export default HeaderComponent;
