import React, { useState, useContext } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import MediaPicker from "../assets/svg/mediapicker.svg";
import { UserContext } from "../context/UserContext";
import * as postService from "../services/postService";
import Ionicons from "react-native-vector-icons/Ionicons";

const PostCreationComponent = ({ onPostCreated, navigation }) => {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal visibility
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const { userProfile, isDarkMode, language } = useContext(UserContext);

  // Chọn ảnh từ thư viện
  const pickMedia = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true, // Cho phép chọn nhiều
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Thêm các file mới vào mảng hiện có
        const newFiles = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.type, // 'image' hoặc 'video'
        }));
        setMediaFiles([...mediaFiles, ...newFiles]);
      }
    } catch (error) {
      console.error("Error picking media:", error);
      alert("Có lỗi khi chọn media");
    }
  };

  // Xóa media
  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Gửi bài viết
  const handleSubmit = async () => {
    if (!userProfile) {
      alert("Không thể tạo bài viết. Vui lòng thử lại sau.");
      return;
    }

    if (!content.trim() && mediaFiles.length === 0) {
      alert("Vui lòng nhập nội dung hoặc chọn ảnh/video!");
      return;
    }

    setIsLoading(true);
    try {
      const result = await postService.createPost(
        userProfile.id,
        content,
        mediaFiles,
        privacy
      );
      setContent("");
      setMediaFiles([]);
      onPostCreated?.();
    } catch (error) {
      console.error("Detailed error:", error.message);
      Alert.alert("Lỗi", "Không thể tạo bài viết. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }

    setModalVisible(false); // Close the modal after submission
  };

  // Hủy bỏ và đóng modal
  const handleCancel = () => {
    setContent("");
    setMediaFiles([]);
    setModalVisible(false); // Close the modal on cancel
  };

  // Render media preview
  const renderMediaPreview = () => {
    return (
      <ScrollView horizontal style={styles(isDarkMode).mediaPreviewContainer}>
        {mediaFiles.map((file, index) => (
          <View key={index} style={styles(isDarkMode).mediaPreviewWrapper}>
            <TouchableOpacity
              style={styles(isDarkMode).removeButton}
              onPress={() => removeMedia(index)}
            >
              <Text style={styles(isDarkMode).removeButtonText}>×</Text>
            </TouchableOpacity>
            {file.type === "video" ? (
              <Video
                source={{ uri: file.uri }}
                style={styles(isDarkMode).mediaPreview}
                resizeMode="cover"
                shouldPlay={false}
              />
            ) : (
              <Image source={{ uri: file.uri }} style={styles(isDarkMode).mediaPreview} />
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  // Thêm component PrivacyDropdown
  const PrivacyDropdown = () => (
    <View style={[
      styles(isDarkMode).privacyDropdown,
      showPrivacyDropdown ? styles(isDarkMode).privacyDropdownShow : null
    ]}>
      <TouchableOpacity
        style={[styles(isDarkMode).privacyOption, privacy === 'public' && styles(isDarkMode).privacyOptionSelected]}
        onPress={() => {
          setPrivacy('public');
          setShowPrivacyDropdown(false);
        }}
      >
        <Ionicons name="earth" size={16} color={privacy === 'public' ? "#316ff6" : "#666"} />
        <View style={styles(isDarkMode).privacyOptionContent}>
          <Text style={[
            styles(isDarkMode).privacyOptionTitle,
            privacy === 'public' && styles(isDarkMode).privacyOptionTitleSelected
          ]}>Công khai</Text>
          <Text style={styles(isDarkMode).privacyOptionDesc}>Tất cả mọi người</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles(isDarkMode).privacyOption, privacy === 'friend' && styles(isDarkMode).privacyOptionSelected]}
        onPress={() => {
          setPrivacy('friend');
          setShowPrivacyDropdown(false);
        }}
      >
        <Ionicons name="people" size={16} color={privacy === 'friend' ? "#316ff6" : "#666"} />
        <View style={styles(isDarkMode).privacyOptionContent}>
          <Text style={[
            styles(isDarkMode).privacyOptionTitle,
            privacy === 'friend' && styles(isDarkMode).privacyOptionTitleSelected
          ]}>Bạn bè</Text>
          <Text style={styles(isDarkMode).privacyOptionDesc}>Chỉ bạn bè của bạn</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles(isDarkMode).privacyOption, privacy === 'private' && styles(isDarkMode).privacyOptionSelected]}
        onPress={() => {
          setPrivacy('private');
          setShowPrivacyDropdown(false);
        }}
      >
        <Ionicons name="lock-closed" size={16} color={privacy === 'private' ? "#316ff6" : "#666"} />
        <View style={styles(isDarkMode).privacyOptionContent}>
          <Text style={[
            styles(isDarkMode).privacyOptionTitle,
            privacy === 'private' && styles(isDarkMode).privacyOptionTitleSelected
          ]}>Chỉ mình tôi</Text>
          <Text style={styles(isDarkMode).privacyOptionDesc}>Chỉ bạn mới nhìn thấy</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles(isDarkMode).container}>
      {/* Nút mở modal (Chỉ làm cảnh, không cần thay đổi) */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles(isDarkMode).header}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{ uri: userProfile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png' }}
              style={styles(isDarkMode).avatar}
            />
          </TouchableOpacity>
          <TextInput
            style={styles(isDarkMode).input}
            placeholder={language === "vn" ? "Bạn đang nghĩ gì?" : "What's in your mind?"}
            placeholderTextColor={isDarkMode ? "#fff" : "#888"}
            value={content}
            onChangeText={setContent}
            multiline
            onPress={() => setModalVisible(true)}
          />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <MediaPicker width={50} height={40} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCancel}
      >
        <ScrollView style={styles(isDarkMode).modalContainer}>
          <Text style={styles(isDarkMode).modalTitle}>Tạo bài viết mới</Text>
          <View style={styles(isDarkMode).modalContent}>
            {/* Hiển thị avatar và tên người dùng */}
            <View style={styles(isDarkMode).headerModal}>
              <Image
                source={{ uri: userProfile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png' }}
                style={styles(isDarkMode).avatarModal}
              />
              <View style={styles(isDarkMode).headerInfo}>
                <Text style={styles(isDarkMode).username}>
                  {userProfile?.first_name || ""} {userProfile?.last_name || ""}
                </Text>
                <TouchableOpacity
                  style={styles(isDarkMode).privacySelector}
                  onPress={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                >
                  <View style={styles(isDarkMode).privacyContent}>
                    <Ionicons
                      name={
                        privacy === "public" ? "earth" :
                          privacy === "private" ? "lock-closed" : "people"
                      }
                      size={16}
                      color="#666"
                    />
                    <Text style={styles(isDarkMode).privacyText}>
                      {privacy === "public" ? "Công khai" :
                        privacy === "private" ? "Chỉ mình tôi" : "Bạn bè"}
                    </Text>
                    <Ionicons
                      name={showPrivacyDropdown ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#666"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {showPrivacyDropdown && (
                <View style={styles(isDarkMode).dropdownContainer}>
                  <PrivacyDropdown />
                </View>
              )}
            </View>

            <TextInput
              style={styles(isDarkMode).inputModal}
              placeholder="Bạn đang nghĩ gì?"
              placeholderTextColor={isDarkMode ? "#fff" : "#888"}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={20}
            />

            {renderMediaPreview()}
            <TouchableOpacity style={styles(isDarkMode).addMediaButton} onPress={pickMedia}>
              <MediaPicker width={50} height={50} />
              <Text style={styles(isDarkMode).addMediaText}>Thêm hình ảnh hoặc video</Text>
            </TouchableOpacity>
            <View style={styles(isDarkMode).actionRow}>
              <TouchableOpacity
                style={styles(isDarkMode).submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles(isDarkMode).submitText}>Đăng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles(isDarkMode).cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles(isDarkMode).cancelText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: 10,
      marginBottom: 8,
    },
    openModalButton: {
      backgroundColor: "#007bff",
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    openModalText: {
      color: "#fff",
      fontSize: 16,
      textAlign: "center",
    },
    modalContainer: {
      flex: 1,
      paddingBlock: 20,
    },
    modalContent: {
      flex: 1,
      justifyContent: "flex-start",
      backgroundColor: "#fff",
      padding: 20,
      width: "100%",
      height: "100%",
    },
    header: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    headerModal: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    avatarModal: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
      width: "75%",
    },
    inputModal: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 10,
      fontSize: 20,
      width: "100%",
      height: 360,
      textAlignVertical: "top",
    },
    imagePreview: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 10,
    },
    videoPreview: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 10,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBlockEnd: 20,
    },
    submitButton: {
      backgroundColor: "#007bff",
      padding: 10,
      borderRadius: 8,
      width: "48%",
    },
    submitText: {
      color: "#fff",
      fontSize: 16,
      textAlign: "center",
    },
    cancelButton: {
      backgroundColor: "#ccc",
      padding: 10,
      borderRadius: 8,
      width: "48%",
    },
    cancelText: {
      color: "#333",
      fontSize: 16,
      textAlign: "center",
    },
    username: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    addMediaButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      fontSize: 18,
      gap: 10,
    },
    addMediaText: {
      fontSize: 18,
    },
    mediaPreviewContainer: {
      flexDirection: "row",
      marginVertical: 10,
    },
    mediaPreviewWrapper: {
      position: "relative",
      marginRight: 10,
    },
    mediaPreview: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    removeButton: {
      position: "absolute",
      right: -5,
      top: -5,
      backgroundColor: "rgba(0,0,0,0.5)",
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    removeButtonText: {
      color: "white",
      fontSize: 16,
    },
    dropdownContainer: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 1000,
    },
    privacyDropdown: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 8,
      marginTop: 4,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 1000,
    },
    privacyOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
    },
    privacyOptionSelected: {
      backgroundColor: '#f0f2f5',
    },
    privacyOptionContent: {
      marginLeft: 12,
    },
    privacyOptionTitle: {
      fontSize: 16,
      color: '#1c1e21',
    },
    privacyOptionTitleSelected: {
      color: '#316ff6',
    },
    privacyOptionDesc: {
      fontSize: 12,
      color: '#65676b',
      marginTop: 2,
    },
    privacySelector: {
      marginTop: 4,
      zIndex: 999,
    },
    privacyContent: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f2f5',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    privacyText: {
      fontSize: 14,
      color: '#666',
    },
    container: {
      backgroundColor: isDarkMode ? "#27262b" : "#fff",
      padding: 10,
      borderRadius: 10,
      marginBottom: 8,
    },
    openModalButton: {
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    modalContainer: {
      flex: 1,
      paddingBlock: 20,
      backgroundColor: isDarkMode ? "#27262b" : "#fff",
    },
    modalContent: {
      flex: 1,
      justifyContent: "flex-start",
      backgroundColor: isDarkMode ? "#27262b" : "#fff",
      padding: 20,
      width: "100%",
      height: "100%",
    },
    header: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    headerModal: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    avatarModal: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
      width: "75%",
      color: isDarkMode ? "#fff" : "#000",
    },
    inputModal: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 10,
      fontSize: 20,
      width: "100%",
      height: 360,
      textAlignVertical: "top",
      color: isDarkMode ? "#fff" : "#000",
    },
    imagePreview: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 10,
    },
    videoPreview: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 10,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBlockEnd: 20,
    },
    submitButton: {
      backgroundColor: "#007bff",
      padding: 10,
      borderRadius: 8,
      width: "48%",
    },
    submitText: {
      color: "#fff",
      fontSize: 16,
      textAlign: "center",
    },
    cancelButton: {
      backgroundColor: "#ccc",
      padding: 10,
      borderRadius: 8,
      width: "48%",
    },
    cancelText: {
      color: "#333",
      fontSize: 16,
      textAlign: "center",
    },
    username: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
      color: isDarkMode ? "#fff" : "#000",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: isDarkMode ? "#fff" : "#000",
    },
    addMediaButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      fontSize: 18,
      gap: 10,
    },
    addMediaText: {
      fontSize: 18,
      color: isDarkMode ? "#fff" : "#000",
    },
    mediaPreviewContainer: {
      flexDirection: "row",
      marginVertical: 10,
    },
    mediaPreviewWrapper: {
      position: "relative",
      marginRight: 10,
    },
    mediaPreview: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    removeButton: {
      position: "absolute",
      right: -5,
      top: -5,
      backgroundColor: "rgba(0,0,0,0.5)",
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    removeButtonText: {
      color: "white",
      fontSize: 16,
    },
  });

export default PostCreationComponent;
