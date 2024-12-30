import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { UserContext } from "../../context/UserContext";
import * as friendshipService from "../../services/friendshipService";
import FriendButton from "../../Components/FriendButton";

const FriendListScreen = ({ navigation, route }) => {
    const { userProfile, isDarkMode, language } = useContext(UserContext);
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const userId = route.params?.userId || userProfile?.id;
    const isOwnProfile = userId === userProfile?.id;

    useEffect(() => {
        loadFriends();
    }, [userId]);

    const loadFriends = async () => {
        try {
            const friendsList = await friendshipService.getFriendsList(userId);
            setFriends(friendsList);
        } catch (error) {
            console.error("Lỗi khi tải danh sách bạn bè:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFriendAction = async (friendId) => {
        try {
            const isFriend = await friendshipService.checkFriendship(friendId);
            if (isFriend) {
                await friendshipService.removeFriend(friendId);
            } else {
                await friendshipService.addFriend(friendId);
            }
            loadFriends(); // Tải lại danh sách bạn bè
        } catch (error) {
            console.error("Lỗi khi thực hiện hành động bạn bè:", error);
        }
    };

    const renderFriendItem = ({ item }) => (
        <TouchableOpacity
            style={styles(isDarkMode).friendItem}
            onPress={() => {
                navigation.navigate("Profile", {
                    screen: "ProfileScreen",
                    params: { userId: item.id },
                });
            }}
        >
            <Image source={{ uri: item.avatar_url }} style={styles(isDarkMode).avatar} />
            <View style={styles(isDarkMode).friendInfo}>
                <Text style={styles(isDarkMode).friendName} numberOfLines={1}>
                    {`${item.first_name} ${item.last_name}`}
                </Text>
                {!isOwnProfile && item.id !== userProfile?.id && (
                    <FriendButton
                        userId={item.id}
                        style={styles(isDarkMode).friendActionButton}
                        onFriendshipChange={loadFriends}
                    />
                )}
            </View>
        </TouchableOpacity>
    );

    const filteredFriends = friends.filter(friend =>
        `${friend.first_name} ${friend.last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <ActivityIndicator size="large" color="#316ff6" />;
    }

    return (
        <View style={styles(isDarkMode).container}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={isDarkMode ? '#27262b' : '#FFF'}
            />
            <View style={styles(isDarkMode).header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles(isDarkMode).backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles(isDarkMode).title}>{language === "vn" ? "Bạn bè" : "Friends"} ({friends.length})</Text>
            </View>

            <TextInput
                style={styles(isDarkMode).searchBar}
                placeholder={language === "vn" ? "Tìm kiếm bạn bè" : "Search friends"}
                placeholderTextColor={isDarkMode ? "#fff" : "#888"}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <FlatList
                data={filteredFriends}
                renderItem={renderFriendItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles(isDarkMode).friendList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = (isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: isDarkMode ? "#27262b" : "#fff",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 10,
        color: isDarkMode ? "#fff" : "#000",
    },
    title: {
        fontSize: 20,
        paddingTop: 10,
        fontWeight: 'bold',
        color: isDarkMode ? "#fff" : "#000",
    },
    searchBar: {
        backgroundColor: isDarkMode ? '#333333' : '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginVertical: 10,
    },
    friendList: {
        justifyContent: 'space-between',
    },
    friendItem: {
        flexDirection: 'row', // Xếp hàng ngang (hình ảnh + tên)
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: isDarkMode ? "#333333" : "#fff",
        borderRadius: 8,
        elevation: 1, // Hiệu ứng đổ bóng nhẹ
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 5,
    },
    friendName: {
        fontSize: 18,
        textAlign: 'center',
        marginLeft: 20,
        color: isDarkMode ? "#fff" : "#000",
    },
    friendInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 20,
    },
    friendActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 20,
    },
    friendActionText: {
        marginLeft: 5,
        color: 'red',
        fontSize: 14,
    },
});

export default FriendListScreen;
