import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { View, Text, Image, StyleSheet } from 'react-native';
import SendIcon from '../../assets/svg/send.svg';

const DirectMessageScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const { user } = route.params; // Lấy thông tin người dùng từ navigation

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Đây là khởi đầu cuộc trò chuyện của bạn với ' + user.name,
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, [user]);

  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={{ marginBottom: 5 }}>
          <SendIcon height={35} width={35}/>
        </View>
      </Send>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header hiển thị avatar và tên */}
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
      </View>
      {/* GiftedChat */}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1, // ID của người dùng hiện tại
          name: 'User',
          avatar: 'https://i.pravatar.cc/150?img=3',
        }}
        placeholder={`Nhập tin nhắn của bạn tới ${user.name}`}
        renderSend={renderSend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DirectMessageScreen;
