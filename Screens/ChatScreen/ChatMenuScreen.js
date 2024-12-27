import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Chat,
  ChannelList,
  ChannelPreviewMessenger,
} from 'stream-chat-expo';
import { ChatContext } from '../../context/ChatContext';
import { UserContext } from '../../context/UserContext';
import * as friendshipService from "../../services/friendshipService";
import { formatTimeAgo } from '../../utils/dateUtils';

const ChatMenuScreen = ({ navigation }) => {
  const { chatClient, clientReady } = useContext(ChatContext);
  const { userProfile, language, isDarkMode } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [existingChannels, setExistingChannels] = useState(new Set());

  // Tải danh sách bạn bè
  const loadFriends = useCallback(async () => {
    try {
      const friendsList = await friendshipService.getFriendsList(userProfile.id);
      setFriends(friendsList);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bạn bè:', err);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const CustomPreview = (props) => {
    const { channel } = props;
    
    // Lưu ID của các thành viên đã có channel
    useEffect(() => {
      const members = Object.values(channel.state.members)
        .map(member => member.user?.id)
        .filter(id => id !== userProfile.id);
      setExistingChannels(prev => new Set([...prev, ...members]));
    }, [channel]);

    const onSelect = () => {
      const otherMember = Object.values(channel.state.members).find(
        member => member.user?.id !== userProfile.id
      );
      
      navigation.navigate('DirectMessage', {
        user: {
          id: otherMember.user.id,
          name: otherMember.user.name,
          avatar_url: otherMember.user.image,
        },
        existingChannel: channel.id
      });
    };

    return (
      <ChannelPreviewMessenger
        {...props}
        onSelect={onSelect}
        formatLatestMessageDate={date => formatTimeAgo(date)}
      />
    );
  };

  const renderFriendItem = ({ item }) => {
    // Không hiển thị bạn bè đã có channel chat
    if (existingChannels.has(item.id)) return null;

    return (
      <TouchableOpacity
        style={styles.friendItem}
        onPress={() => navigation.navigate('DirectMessage', {
          user: {
            id: item.id,
            name: `${item.first_name} ${item.last_name}`,
            avatar_url: item.avatar_url,
          }
        })}
      >
        <Image
          source={
            item.avatar_url
              ? { uri: item.avatar_url }
              : require('../../assets/avatar/avatar_default.png')
          }
          style={styles.avatar}
        />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={styles.startChat}>
            Bắt đầu cuộc trò chuyện
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filters = {
    type: 'messaging',
    members: { $in: [userProfile.id] },
  };

  const sort = {
    last_message_at: -1,
  };

  if (!clientReady || !chatClient) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Chat client={chatClient}>
        <ChannelList
          filters={filters}
          sort={sort}
          Preview={CustomPreview}
          loadingIndicator={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        />
      </Chat>
      <FlatList
        data={friends}
        renderItem={renderFriendItem}
        keyExtractor={item => item.id}
        style={styles.friendsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsList: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
  },
  startChat: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
});

export default ChatMenuScreen;
