import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Chat, Channel, MessageList, MessageInput } from 'stream-chat-expo';
import { ChatContext } from '../../context/ChatContext';
import { UserContext } from '../../context/UserContext';
import { supabase } from '../../lib/supabase';

const DirectMessageScreen = ({ route }) => {
  const { user, existingChannel } = route.params;
  const { chatClient, clientReady, connectUser } = useContext(ChatContext);
  const { userProfile } = useContext(UserContext);
  const [channel, setChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeChannel = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!clientReady || !chatClient) {
        await connectUser();
      }

      // Gọi Supabase Edge Function để tạo/cập nhật người dùng
      const { data, error: fnError } = await supabase.functions.invoke('manage-stream-chat', {
        body: {
          action: 'upsert_users',
          users: [
            {
              id: userProfile.id,
              name: `${userProfile.first_name} ${userProfile.last_name}`,
              image: userProfile.avatar_url,
            },
            {
              id: user.id,
              name: user.name,
              image: user.avatar_url,
            }
          ]
        }
      });

      if (fnError) throw fnError;

      // Nếu đã có channel ID từ trước
      if (existingChannel) {
        const existingChan = chatClient.channel('messaging', existingChannel);
        await existingChan.watch();
        setChannel(existingChan);
        setIsLoading(false);
        return;
      }

      // Tạo channel ID mới
      const sortedIds = [chatClient.userID, user.id].sort();
      const channelId = sortedIds.join('-').slice(0, 64);

      const newChannel = chatClient.channel('messaging', channelId, {
        members: [chatClient.userID, user.id],
        name: user.name,
      });

      await newChannel.watch();
      setChannel(newChannel);
    } catch (err) {
      console.error('Lỗi khi khởi tạo channel:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeChannel();
  }, [user.id, chatClient, clientReady]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Có lỗi xảy ra: {error}</Text>
        <TouchableOpacity onPress={initializeChannel}>
          <Text>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!channel) {
    return (
      <View style={styles.errorContainer}>
        <Text>Không thể tải cuộc trò chuyện</Text>
      </View>
    );
  }

  return (
    <Chat client={chatClient}>
      <Channel channel={channel}>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default DirectMessageScreen;
