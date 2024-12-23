import React, { useState, useEffect, useContext } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { UserContext } from "../context/UserContext";
import * as friendshipService from "../services/friendshipService";
import Ionicons from "@expo/vector-icons/Ionicons";
const FriendButton = ({ userId, style, onFriendshipChange }) => {
  const { userProfile } = useContext(UserContext);
  const [isFriend, setIsFriend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkFriendshipStatus();
  }, [userId]);

  const checkFriendshipStatus = async () => {
    try {
      const status = await friendshipService.checkFriendship(userId);
      setIsFriend(status);
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái bạn bè:", error);
    }
  };

  const handleFriendAction = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isFriend) {
        await friendshipService.removeFriend(userId);
        setIsFriend(false);
      } else {
        await friendshipService.addFriend(userId);
        setIsFriend(true);
      }
      if (onFriendshipChange) {
        onFriendshipChange(isFriend);
      }
    } catch (error) {
      console.error("Lỗi khi thực hiện hành động bạn bè:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFriend ? styles.unfriendButton : styles.addFriendButton,
        style,
      ]}
      onPress={handleFriendAction}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={isFriend ? "#000" : "#fff"} />
      ) : (
        <>
          <Ionicons
            name={isFriend ? "person-remove-outline" : "person-add-outline"}
            size={20}
            color={isFriend ? "#000" : "#fff"}
          />
          <Text
            style={[
              styles.buttonText,
              styles.buttonFriendText,
            ]}
          >
            {isFriend ? "Hủy kết bạn" : "Kết bạn"}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
  },
  addFriendButton: {
    backgroundColor: "#1877F2",
  },
  unfriendButton: {
    backgroundColor: "#E4E6EB",
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonFriendText: {
    color: "#000000",
  },
});

export default FriendButton;
