import React, { useState, useCallback, useEffect, useContext } from 'react';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { View, Text, Image, StyleSheet } from 'react-native';
import SendIcon from '../../assets/svg/send.svg';
import { UserContext } from '../../context/UserContext';

const DirectMessageScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const { user } = route.params;
  const { userProfile } = useContext(UserContext);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Đây là khởi đầu cuộc trò chuyện của bạn với ' + `${user.name}`,
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
        <Image 
          source={{ 
            uri: user?.avatar || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
          }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{user.name}</Text>
      </View>
      {/* GiftedChat */}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userProfile.id,
          name: `${userProfile.first_name} ${userProfile.last_name}`,
          avatar: userProfile.avatar_url
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
