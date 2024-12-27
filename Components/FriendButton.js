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
import AddFriendIcon from "../assets/svg/add_friend.svg";
import RemoveFriendIcon from "../assets/svg/remove_friend.svg";


const FriendButton = ({ userId, style, onFriendshipChange }) => {
  const { userProfile, language } = useContext(UserContext);
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
      ]}
      onPress={handleFriendAction}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={isFriend ? "#000" : "#fff"} />
      ) : (
        <>
          {isFriend ? (<RemoveFriendIcon width={23} height={23} />) : (<AddFriendIcon width={23} height={23} />)}
          <Text
            style={[
              styles.buttonText,
              styles.buttonFriendText,
              isFriend ? styles.buttonUnfriendText : null,
            ]}
          >
            {isFriend
              ? (language === "vn" ? "Hủy kết bạn" : "Unfriend")
              : (language === "vn" ? "Kết bạn" : "Add friend")}
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
    borderRadius: 5,
    justifyContent: "center",
    width: "40%",
  },
  addFriendButton: {
    backgroundColor: "#316ff6",
  },
  unfriendButton: {
    backgroundColor: "#E2E5E9",
    color: "#fff",
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonFriendText: {
    color: "#fff",
  },
  buttonUnfriendText: {
    color: "black",
  },
});

export default FriendButton;
