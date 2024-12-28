import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import Ionicons from "@expo/vector-icons/Ionicons";
import PostComponent from '../../Components/PostComponent';
import { UserContext } from '../../context/UserContext';

const SearchScreen = ({ navigation }) => {
  const { userProfile, language, isDarkMode} = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'posts', 'people'
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length >= 1) {
      performSearch();
    } else {
      setSearchResults({ users: [], posts: [] });
    }
  }, [searchQuery]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      // Tìm kiếm users
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .or(`first_name.ilike.%${searchQuery}%, last_name.ilike.%${searchQuery}%`)
        .limit(10);

      // Tìm kiếm posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          profiles!posts_user_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          post_media (
            id,
            media_url,
            media_type
          ),
          post_likes (
            id,
            user_id
          ),
          comments (
            id,
            content,
            created_at,
            user_id,
            profiles!comments_user_id_fkey (
              id,
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .ilike('content', `%${searchQuery}%`)
        .limit(10);

      if (usersError) throw usersError;
      if (postsError) throw postsError;

      setSearchResults({
        users: users || [],
        posts: posts || [],
      });
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles(isDarkMode).userItem}
      onPress={() => navigation.navigate('Profile', { userId: item.id })}
    >
      <Image
        source={{ uri: item?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png' }}
        style={styles(isDarkMode).avatar}
      />
      <Text style={styles(isDarkMode).userName}>
        {item.first_name} {item.last_name}
      </Text>
    </TouchableOpacity>
  );

  const getContent = () => {
    if (isLoading) {
      return <ActivityIndicator style={styles(isDarkMode).loading} size="large" />;
    }

    if (searchQuery.length === 0) {
      return (
        <View style={styles(isDarkMode).emptyState}>
          <Text style={styles(isDarkMode).emptyStateText}>
            Nhập từ khóa để tìm kiếm
          </Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'people':
        return (
          <FlatList
            data={searchResults.users}
            renderItem={renderUserItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <Text style={styles(isDarkMode).noResults}>Không tìm thấy người dùng</Text>
            }
          />
        );
      case 'posts':
        return (
          <FlatList
            data={searchResults.posts}
            renderItem={({ item }) => <PostComponent post={item} userProfile={userProfile} navigation={navigation} />}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <Text style={styles(isDarkMode).noResults}>Không tìm thấy bài viết</Text>
            }
          />
        );
      default: // 'all'
        return (
          <>
            {searchResults.users.length > 0 && (
              <View>
                <Text style={styles(isDarkMode).sectionTitle}>Người dùng</Text>
                <FlatList
                  data={searchResults.users.slice(0, 3)}
                  renderItem={renderUserItem}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
              </View>
            )}
            {searchResults.posts.length > 0 && (
              <View>
                <Text style={styles(isDarkMode).sectionTitle}>Bài viết</Text>
                <FlatList
                  data={searchResults.posts.slice(0, 3)}
                  renderItem={({ item }) => <PostComponent post={item} userProfile={userProfile} navigation={navigation} />}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
              </View>
            )}
          </>
        );
    }
  };

  return (
    <View style={styles(isDarkMode).container}>
      <View style={styles(isDarkMode).header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles(isDarkMode).backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles(isDarkMode).searchInput}
          placeholder="Tìm kiếm..."
          value={searchQuery}
          placeholderTextColor={isDarkMode ? "#fff" : "#888"}
          onChangeText={setSearchQuery}
          autoFocus
        />
      </View>

      <View style={styles(isDarkMode).tabs}>
        <TouchableOpacity
          style={[styles(isDarkMode).tab, activeTab === 'all' && styles(isDarkMode).activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles(isDarkMode).tabText, activeTab === 'all' && styles(isDarkMode).activeTabText]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles(isDarkMode).tab, activeTab === 'posts' && styles(isDarkMode).activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles(isDarkMode).tabText, activeTab === 'posts' && styles(isDarkMode).activeTabText]}>
            Bài viết
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles(isDarkMode).tab, activeTab === 'people' && styles(isDarkMode).activeTab]}
          onPress={() => setActiveTab('people')}
        >
          <Text style={[styles(isDarkMode).tabText, activeTab === 'people' && styles(isDarkMode).activeTabText]}>
            Mọi người
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles(isDarkMode).content}>
        {getContent()}
      </View>
    </View>
  );
};

const styles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#28242c' : '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: isDarkMode ? 'black' : '#fff',
    color: isDarkMode ? '#fff' : '#000',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#28242c' : '#eee',
    color: isDarkMode ? '#28242c' : '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#316ff6',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#316ff6',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  loading: {
    marginTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
});

export default SearchScreen; 