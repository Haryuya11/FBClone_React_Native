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

const PostEditComponent = ({ post, visible, onClose, onPostUpdated }) => {
  const [content, setContent] = useState(post.content);
  const [mediaFiles, setMediaFiles] = useState(
    post.post_media?.map(media => ({
      uri: postService.getMediaUrl(media.media_url),
      type: media.media_type,
      existingPath: media.media_url
    })) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useContext(UserContext);
  const [privacy, setPrivacy] = useState(post.privacy);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);

  // Chọn ảnh/video từ thư viện
  const pickMedia = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const newFiles = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.type === 'image' ? 'image' : 'video',
        }));
        setMediaFiles([...mediaFiles, ...newFiles]);
      }
    } catch (error) {
      console.error("Error picking media:", error);
      Alert.alert("Lỗi", "Không thể chọn media. Vui lòng thử lại.");
    }
  };

  // Xóa media
  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Thêm component PrivacyDropdown
  const PrivacyDropdown = () => (
    <View style={[
      styles.privacyDropdown,
      showPrivacyDropdown ? styles.privacyDropdownShow : null
    ]}>
      <TouchableOpacity 
        style={[styles.privacyOption, privacy === 'public' && styles.privacyOptionSelected]}
        onPress={() => {
          setPrivacy('public');
          setShowPrivacyDropdown(false);
        }}
      >
        <Ionicons name="earth" size={16} color={privacy === 'public' ? "#316ff6" : "#666"} />
        <View style={styles.privacyOptionContent}>
          <Text style={[
            styles.privacyOptionTitle,
            privacy === 'public' && styles.privacyOptionTitleSelected
          ]}>Công khai</Text>
          <Text style={styles.privacyOptionDesc}>Tất cả mọi người</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.privacyOption, privacy === 'friend' && styles.privacyOptionSelected]}
        onPress={() => {
          setPrivacy('friend');
          setShowPrivacyDropdown(false);
        }}
      >
        <Ionicons name="people" size={16} color={privacy === 'friend' ? "#316ff6" : "#666"} />
        <View style={styles.privacyOptionContent}>
          <Text style={[
            styles.privacyOptionTitle,
            privacy === 'friend' && styles.privacyOptionTitleSelected
          ]}>Bạn bè</Text>
          <Text style={styles.privacyOptionDesc}>Chỉ bạn bè của bạn</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.privacyOption, privacy === 'private' && styles.privacyOptionSelected]}
        onPress={() => {
          setPrivacy('private');
          setShowPrivacyDropdown(false);
        }}
      >
        <Ionicons name="lock-closed" size={16} color={privacy === 'private' ? "#316ff6" : "#666"} />
        <View style={styles.privacyOptionContent}>
          <Text style={[
            styles.privacyOptionTitle,
            privacy === 'private' && styles.privacyOptionTitleSelected
          ]}>Chỉ mình tôi</Text>
          <Text style={styles.privacyOptionDesc}>Chỉ bạn mới nhìn thấy</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Cập nhật bài viết
  const handleUpdate = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung hoặc chọn ảnh/video!");
      return;
    }

    setIsLoading(true);
    try {
      const newMedias = mediaFiles.filter(file => !file.existingPath);
      const existingMedias = mediaFiles.filter(file => file.existingPath);

      const result = await postService.updatePost(
        post.id,
        userProfile.id,
        content,
        newMedias,
        existingMedias.map(media => media.existingPath),
        privacy
      );

      onPostUpdated?.(result);
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Lỗi", "Không thể cập nhật bài viết. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render media preview
  const renderMediaPreview = () => {
    return (
      <ScrollView horizontal style={styles.mediaPreviewContainer}>
        {mediaFiles.map((file, index) => (
          <View key={index} style={styles.mediaPreviewWrapper}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeMedia(index)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
            {file.type === "video" ? (
              <Video
                source={{ uri: file.uri }}
                style={styles.mediaPreview}
                resizeMode="cover"
                shouldPlay={false}
                useNativeControls
              />
            ) : (
              <Image source={{ uri: file.uri }} style={styles.mediaPreview} />
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ScrollView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Chỉnh sửa bài viết</Text>
        <View style={styles.modalContent}>
          {/* Header với avatar và tên người dùng */}
          <View style={styles.headerModal}>
            <Image
              source={{ uri: userProfile?.avatar_url }}
              style={styles.avatarModal}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.username}>
                {userProfile?.first_name} {userProfile?.last_name}
              </Text>
              <TouchableOpacity 
                style={styles.privacySelector}
                onPress={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
              >
                <View style={styles.privacyContent}>
                  <Ionicons 
                    name={
                      privacy === "public" ? "earth" :
                      privacy === "private" ? "lock-closed" : "people"
                    } 
                    size={16} 
                    color="#666"
                  />
                  <Text style={styles.privacyText}>
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
              <View style={styles.dropdownContainer}>
                <PrivacyDropdown />
              </View>
            )}
          </View>

          <TextInput
            style={styles.inputModal}
            placeholder="Bạn đang nghĩ gì?"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={20}
          />

          {renderMediaPreview()}
          
          <TouchableOpacity style={styles.addMediaButton} onPress={pickMedia}>
            <MediaPicker width={50} height={50} />
            <Text style={styles.addMediaText}>Thêm hình ảnh hoặc video</Text>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleUpdate}
              disabled={isLoading}
            >
              <Text style={styles.submitText}>
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  });

export default PostEditComponent; 