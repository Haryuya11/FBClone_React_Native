import React, { useState, useEffect, useContext } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { UserContext } from "../context/UserContext";
import * as friendshipService from "../services/friendshipService";
import AddFriendIcon from "../assets/svg/add_friend.svg";
import RemoveFriendIcon from "../assets/svg/remove_friend.svg";


const FriendButton = ({ userId, style, onFriendshipChange }) => {
  const { userProfile, language } = useContext(UserContext);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkFriendshipStatus = async () => {
    try {
      setIsLoading(true);
      const status = await friendshipService.getFriendshipStatus(userId);
      setFriendshipStatus(status);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể kiểm tra trạng thái kết bạn');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkFriendshipStatus();
  }, [userId]);

  

  const handleFriendRequest = async () => {
    try {
      setIsLoading(true);
      if (!friendshipStatus) {
        await friendshipService.sendFriendRequest(userId);
        setFriendshipStatus('pending');
      } else if (friendshipStatus === 'pending') {
        // Nếu là người nhận request
        await friendshipService.acceptFriendRequest(userId);
        setFriendshipStatus('accepted');
      }
      if (onFriendshipChange) onFriendshipChange();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyle = () => {
    switch (friendshipStatus) {
      case 'accepted':
        return styles.unfriendButton;
      case 'pending':
        return styles.pendingButton;
      default:
        return styles.addFriendButton;
    }
  };

  const getButtonText = () => {
    switch (friendshipStatus) {
      case 'accepted':
        return 'Bạn bè';
      case 'pending':
        if(userId === userProfile.id)
          return 'Đã gửi lời mời';
        else
          return 'Đã nhận lời mời';
      default:
        return 'Thêm bạn';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={handleFriendRequest}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" size="small" />
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
    maxWidth: 150
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
    color: "#fff",
  },
  buttonFriendText: {
    color: "#fff",
  },
  buttonUnfriendText: {
    color: "#fff",
  },
  pendingButton: {
    backgroundColor: "#ffd700",
  },
});

export default FriendButton;
