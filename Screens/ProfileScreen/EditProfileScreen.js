import React, {useState, useContext} from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import {UserContext} from "../../context/UserContext";
import * as ImagePicker from "expo-image-picker";
import {supabase} from "../../lib/supabase";

const EditProfileScreen = ({navigation}) => {
    const {userProfile, updateProfile, refreshProfile, updateImageCache, isDarkMode, language} = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [avatar, setAvatar] = useState({
        uri: userProfile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png',
    });
    const [background, setBackground] = useState({
        uri: userProfile?.background_image || "https://t4.ftcdn.net/jpg/07/69/40/97/360_F_769409709_PjhFP5bP2AZVJinAEE4tAVKNkQVhQMpH.jpg",
    });

    const [name, setName] = useState("Nguyễn Văn A");
    const [email, setEmail] = useState("example@gmail.com");
    const [phone, setPhone] = useState("0123456789");

    const handleSave = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            let avatarUrl = userProfile.avatar_url;
            let backgroundUrl = userProfile.background_image;

            if (!avatar.uri.includes("supabase.co")) {
                const fileExt = avatar.uri.split(".").pop();
                const fileName = `${userProfile.id}.${fileExt}`;

                const {error: uploadError} = await supabase.storage
                    .from("avatars")
                    .upload(
                        fileName,
                        {
                            uri: avatar.uri,
                            type: "image/" + fileExt,
                            name: fileName,
                        },
                        {
                            upsert: true,
                        }
                    );

                if (uploadError) {
                    Alert.alert(
                        "Lỗi",
                        "Có lỗi xảy ra khi tải ảnh đại diện: " + uploadError.message
                    );
                    throw uploadError;
                }

                const {data: fileData} = supabase.storage
                    .from("avatars")
                    .getPublicUrl(fileName);

                avatarUrl = fileData.publicUrl;
            }

            if (!background.uri.includes("supabase.co")) {
                const fileExt = background.uri.split(".").pop();
                const fileName = `${userProfile.id}.${fileExt}`;

                const {error: uploadError} = await supabase.storage
                    .from("backgrounds")
                    .upload(
                        fileName,
                        {
                            uri: background.uri,
                            type: "image/" + fileExt,
                            name: fileName,
                        },
                        {
                            upsert: true,
                        }
                    );

                if (uploadError) {
                    Alert.alert(
                        "Lỗi",
                        "Có lỗi xảy ra khi tải ảnh bìa: " + uploadError.message
                    );
                    throw uploadError;
                }

                const {data: fileData} = supabase.storage
                    .from("backgrounds")
                    .getPublicUrl(fileName);

                backgroundUrl = fileData.publicUrl;
            }

            updateImageCache(avatarUrl, backgroundUrl);

            const updateData = {
                ...userProfile,
                avatar_url: avatarUrl,
                background_image: backgroundUrl,
            };

            await updateProfile(updateData);
            await refreshProfile();

            Alert.alert("Thành công", "Cập nhật thông tin thành công!", [
                {text: "OK", onPress: () => navigation.goBack()},
            ]);
        } catch (error) {
            console.error("Save error:", error);
            Alert.alert("Lỗi", "Không thể cập nhật thông tin: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    const selectImage = async (type) => {
        try {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                alert("Permission to access media library is required!");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: type === "avatar" ? [1, 1] : [16, 9],
                quality: 1,
            });

            if (!result.canceled) {
                if (type === "avatar") {
                    setAvatar({uri: result.assets[0].uri});
                } else {
                    setBackground({uri: result.assets[0].uri});
                }
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <ScrollView style={styles(isDarkMode).container}>
            {/* Header */}
            <View style={styles(isDarkMode).header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles(isDarkMode).backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles(isDarkMode).title}>Chỉnh sửa trang cá nhân</Text>
            </View>

            {/* Cover Photo */}
            <View style={styles(isDarkMode).coverPhotoContainer}>
                <Image
                    source={{
                        uri: background.uri,
                    }}
                    style={styles(isDarkMode).coverPhoto}
                />
                <TouchableOpacity
                    style={styles(isDarkMode).editCoverButton}
                    onPress={() => {
                        selectImage("background");
                    }}
                >
                    <Text style={styles(isDarkMode).editButtonText}>Thay đổi ảnh bìa</Text>
                </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View style={styles(isDarkMode).avatarContainer}>
                <Image
                    source={{
                        uri: avatar.uri,
                    }}
                    style={styles(isDarkMode).avatar}
                />
                <TouchableOpacity
                    style={styles(isDarkMode).editAvatarButton}
                    onPress={() => {
                        selectImage("avatar");
                    }}
                >
                    <Text style={styles(isDarkMode).editButtonText}>Thay đổi ảnh đại diện</Text>
                </TouchableOpacity>
            </View>

            {/* Form chỉnh sửa thông tin */}
            <View style={styles(isDarkMode).form}>
                <Text style={styles(isDarkMode).label}>Tên</Text>
                <TextInput
                    style={styles(isDarkMode).input}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />

                <Text style={styles(isDarkMode).label}>Email</Text>
                <TextInput
                    style={styles(isDarkMode).input}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                />

                <Text style={styles(isDarkMode).label}>Số điện thoại</Text>
                <TextInput
                    style={styles(isDarkMode).input}
                    value={phone}
                    onChangeText={(text) => setPhone(text)}
                    keyboardType="phone-pad"
                />
            </View>

            {/* Buttons */}
            <View style={styles(isDarkMode).buttonContainer}>
                <TouchableOpacity
                    style={styles(isDarkMode).saveButton}
                    onPress={handleSave}
                    onDisabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff"/>
                    ) : (
                        <Text style={styles(isDarkMode).buttonText}>Lưu thay đổi</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles(isDarkMode).cancelButton} onPress={handleCancel}>
                    <Text style={styles(isDarkMode).buttonText}>Hủy</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = (isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? "#27262b" : "#fff",
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        paddingTop: 10,
    },
    backButton: {
        fontSize: 24,
        fontWeight: "bold",
        marginRight: 10,
        color: isDarkMode ? "#fff" : "#000",
    },
    title: {
        fontSize: 20,
        marginTop: 10,
        fontWeight: "bold",
        color: isDarkMode ? "#fff" : "#000",
    },
    coverPhotoContainer: {
        position: "relative",
    },
    coverPhoto: {
        width: "100%",
        height: 200,
        borderRadius: 8,
    },
    editCoverButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "#000",
        padding: 8,
        borderRadius: 5,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 12,
    },
    avatarContainer: {
        alignItems: "center",
        marginTop: -80,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 200,
        borderWidth: 3,
        borderColor: "#fff",
        backgroundColor: "#f0f0f0",
    },
    editAvatarButton: {
        marginTop: 10,
        backgroundColor: "#000",
        padding: 8,
        borderRadius: 5,
    },
    form: {
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 5,
        color: isDarkMode ? "#fff" : "#000",
    },
    input: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    saveButton: {
        flex: 1,
        backgroundColor: "#1877F2",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginRight: 5,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#F02849",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginLeft: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default EditProfileScreen;
