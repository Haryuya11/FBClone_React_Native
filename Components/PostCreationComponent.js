import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MediaPicker from '../assets/svg/mediapicker.svg';

const PostCreationComponent = ({ onPostSubmit }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    // Chọn ảnh từ thư viện
    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Gửi bài viết
    const handleSubmit = () => {
        if (!content.trim() && !image) {
            alert('Vui lòng nhập nội dung hoặc chọn ảnh!');
            return;
        }

        // Thông tin người dùng hiện tại
        const newPost = {
            id: Date.now().toString(),
            user: 'User',
            content,
            image,
            avatar: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png', // Ảnh đại diện mặc định
            time: 'Vừa xong',
            like: 0,
            comment: 0,
            share: 0,
            isLike: false,
        };

        onPostSubmit(newPost); // Truyền bài viết lên component cha
        setContent('');
        setImage(null);
    };

    return (
        <View style={styles.container}>
            {/* Input nội dung bài viết */}
            <View style={styles.header}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png' }} style={styles.avatar} />

                <TextInput
                    style={styles.input}
                    placeholder="Bạn đang nghĩ gì?"
                    value={content}
                    onChangeText={setContent}
                    multiline
                />
                <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                    <MediaPicker width={40} height={40} />
                </TouchableOpacity>
            </View>
            {/* Hiển thị ảnh nếu có */}
            {image && (
                <Image source={{ uri: image }} style={styles.imagePreview} />
            )}

            {/* Các nút hành động */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Đăng</Text>
                </TouchableOpacity>
            </View>
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        width: '75%',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        fontSize: 16,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
    },
    submitText: {
        fontSize: 16,
        color: '#fff',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,

    },
});

export default PostCreationComponent;
