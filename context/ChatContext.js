import React, { createContext, useState, useContext, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { UserContext } from "./UserContext";
import { supabase } from "../lib/supabase";

export const ChatContext = createContext();

const chatApiKey = "53avdbfw3n8x";

export const ChatProvider = ({ children }) => {
  const [chatClient, setChatClient] = useState(null);
  const [clientReady, setClientReady] = useState(false);
  const { userProfile, isAuthenticated } = useContext(UserContext);

  const initClient = () => {
    const client = StreamChat.getInstance(chatApiKey);
    setChatClient(client);
    return client;
  };

  const disconnectClient = async () => {
    if (chatClient) {
      await chatClient.disconnectUser();
      chatClient.closeConnection();
      setChatClient(null);
      setClientReady(false);
    }
  };

  const connectUser = async () => {
    try {
      if (!userProfile?.id) {
        console.log("Waiting for user profile...");
        return;
      }

      // Khởi tạo client mới nếu chưa có
      const client = chatClient || initClient();

      const { data, error } = await supabase.functions.invoke("manage-stream-chat", {
        body: {
          action: "token",
          user_id: userProfile.id,
        },
      });

      if (error) throw error;

      if (!data.token) {
        throw new Error("No token received from server");
      }

      await client.connectUser(
        {
          id: userProfile.id,
          name: `${userProfile.first_name} ${userProfile.last_name}`,
          image: userProfile.avatar_url,
        },
        data.token
      );

      setClientReady(true);
    } catch (error) {
      console.error("Error connecting user to Stream:", error);
      throw error;
    }
  };

  // Xử lý khi đăng nhập/đăng xuất
  useEffect(() => {
    if (isAuthenticated && userProfile?.id) {
      console.log("Connecting to Stream Chat...");
      connectUser().catch(console.error);
    } else {
      console.log("Disconnecting from Stream Chat...");
      disconnectClient();
    }

    return () => {
      disconnectClient();
    };
  }, [isAuthenticated, userProfile?.id]);

  return (
    <ChatContext.Provider value={{ chatClient, clientReady, connectUser }}>
      {children}
    </ChatContext.Provider>
  );
};
