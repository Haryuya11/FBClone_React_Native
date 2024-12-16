import React, { useState, useContext } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Text, Image, StyleSheet, Modal, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import MediaPicker from '../assets/svg/mediapicker.svg';
import { UserContext } from "../context/UserContext";

const PostCreationComponent = ({ onPostSubmit, navigation }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // State to control the modal visibility

    const { userProfile } = useContext(UserContext);

    // Chọn ảnh từ thư viện
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All, // Hỗ trợ cả ảnh và video
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            if (result.assets[0].type === 'video') {
                setImage(null); // Xóa ảnh nếu đã chọn video
                setVideo(result.assets[0].uri);
            } else {
                setVideo(null); // Xóa video nếu đã chọn ảnh
                setImage(result.assets[0].uri);
            }
        }
    };

    // Gửi bài viết
    const handleSubmit = () => {
        if (!content.trim() && !image && !video) {
            alert('Vui lòng nhập nội dung hoặc chọn ảnh/video!');
            return;
        }

        // Thông tin người dùng hiện tại
        const newPost = {
            id: Date.now().toString(),
            user: (userProfile?.first_name || "") + " " + (userProfile?.last_name || ""),
            content,
            image,
            video, // Thêm video vào bài viết
            avatar: userProfile.avatar_url,
            time: 'Vừa xong',
            like: 0,
            comment: 0,
            share: 0,
            isLike: false,
        };

        onPostSubmit(newPost);
        setContent('');
        setImage(null);
        setVideo(null);
        setModalVisible(false); // Close the modal after submission
    };

    // Hủy bỏ và đóng modal
    const handleCancel = () => {
        setContent('');
        setImage(null);
        setVideo(null);
        setModalVisible(false); // Close the modal on cancel
    };

    return (
        <View style={styles.container}>
            {/* Nút mở modal (Chỉ làm cảnh, không cần thay đổi) */}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>

                        <Image source={{ uri: userProfile.avatar_url }} style={styles.avatar} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Bạn đang nghĩ gì?"
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
                <ScrollView style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Tạo bài viết mới</Text>
                    <View style={styles.modalContent}>
                        {/* Hiển thị avatar và tên người dùng */}
                        <View style={styles.headerModal}>
                            <Image source={{ uri: userProfile.avatar_url }} style={styles.avatarModal} />
                            <Text style={styles.username}>{userProfile?.first_name || ""} {userProfile?.last_name || ""}</Text>
                        </View>

                        <TextInput
                            style={styles.inputModal}
                            placeholder='Bạn đang nghĩ gì?'
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={20}
                        />

                        {/* Hiển thị ảnh nếu có */}
                        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
                        {video && (
                            <Video
                                source={{ uri: video }}
                                style={styles.videoPreview}
                                useNativeControls
                                resizeMode="contain"
                            />
                        )}
                        <TouchableOpacity style={styles.addMediaButton} onPress={pickImage}>
                            <MediaPicker width={50} height={50} />
                            <Text style={styles.addMediaText}>Thêm hình ảnh hoặc video</Text>
                        </TouchableOpacity>
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitText}>Đăng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                <Text style={styles.cancelText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 8,
    },
    openModalButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    openModalText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        paddingBlock: 20,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        padding: 20,
        width: '100%',
        height: '100%',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerModal: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        width: '75%',
    },
    inputModal: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 20,
        width: '100%',
        height: 360,
        textAlignVertical: "top",
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    videoPreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBlockEnd: 20,
    },
    submitButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        width: '48%',
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        width: '48%',
    },
    cancelText: {
        color: '#333',
        fontSize: 16,
        textAlign: 'center',
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    addMediaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 18,
        gap: 10,
    },
    addMediaText: {
        fontSize: 18,
    }
});

export default PostCreationComponent;
