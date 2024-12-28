import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    StatusBar,
} from 'react-native';
import * as friendshipService from "../../services/friendshipService";
import { UserContext } from "../../context/UserContext";
import HeaderNavigationComponent from '../../Components/HeaderNavigationComponent';
import Home from '../../assets/svg/home_outline.svg';
import Video from '../../assets/svg/video_outline.svg';
import Post from '../../assets/svg/post_outline.svg';
import Search from '../../assets/svg/search.svg';
import Chat from '../../assets/svg/chat.svg';
import Ionicons from "@expo/vector-icons/Ionicons";
import Friend from '../../assets/svg/friend_blue.svg';
import HomeDark from '../../assets/svg/darkmode/home_outline.svg';
import VideoDark from '../../assets/svg/darkmode/video_outline.svg';

const FriendRequestScreen = ({ navigation }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingIds, setProcessingIds] = useState(new Set());
    const { userProfile, isDarkMode, language } = useContext(UserContext);

    useEffect(() => {
        loadFriendRequests();
    }, []);

    const loadFriendRequests = async () => {
        try {
            const requests = await friendshipService.getFriendRequests();
            setFriendRequests(requests);
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể tải danh sách lời mời kết bạn');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async (friendshipId) => {
        if (processingIds.has(friendshipId)) return;

        try {
            await friendshipService.acceptFriendRequest(friendshipId);
            setFriendRequests(prev => prev.filter(request => request.id !== friendshipId));
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể chấp nhận lời mời kết bạn');
        }
    };

    const handleReject = async (friendshipId) => {
        try {
            await friendshipService.rejectFriendRequest(friendshipId);
            setFriendRequests(prev => prev.filter(request => request.id !== friendshipId));
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể từ chối lời mời kết bạn');
        }
    };

    const navigationButtons = [
        { name: "Home", label: isDarkMode ? <HomeDark width={35} height={35} /> : <Home width={35} height={35} /> },
        { name: "Video", label: isDarkMode ? <VideoDark width={35} height={35} /> : <Video width={35} height={35} /> },
        { name: "FriendRequest", label: <Friend width={35} height={35} /> },
        {
            name: "Profile",
            label: (
                <Image
                    source={{
                        uri: userProfile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
                    }}
                    style={styles(isDarkMode).profileIcon}
                />
            ),
        },
    ];

    const handleNavigationPress = (buttonName) => {
        navigation.navigate(buttonName);
    };

    if (isLoading) {
        return <ActivityIndicator size="large" style={styles(isDarkMode).loader} />;
    }

    return (
        <View style={styles(isDarkMode).container}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={isDarkMode ? '#27262b' : '#FFF'}
            />
            <View style={styles(isDarkMode).headerContainer}>
                <HeaderNavigationComponent
                    navigationButtons={navigationButtons}
                    onButtonPress={handleNavigationPress}
                    selectedButton="FriendRequest"
                />
            </View>
            <FlatList
                data={friendRequests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles(isDarkMode).requestItem}>
                        <Image
                            source={{ uri: item.profiles.avatar_url }}
                            style={styles(isDarkMode).avatar}
                        />
                        <View style={styles(isDarkMode).requestInfo}>
                            <Text style={styles(isDarkMode).name}>
                                {item.profiles.first_name} {item.profiles.last_name}
                            </Text>
                            <View style={styles(isDarkMode).buttonContainer}>
                                <TouchableOpacity
                                    style={[styles(isDarkMode).button, styles(isDarkMode).acceptButton]}
                                    onPress={() => handleAccept(item.id)}
                                >
                                    <Text style={styles(isDarkMode).buttonText}>Chấp nhận</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles(isDarkMode).button, styles(isDarkMode).rejectButton]}
                                    onPress={() => handleReject(item.id)}
                                >
                                    <Text style={styles(isDarkMode).buttonText}>Từ chối</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <View style={styles(isDarkMode).emptyContainer}>
                        <Text style={styles(isDarkMode).emptyText}>Không có lời mời kết bạn nào</Text>
                    </View>
                )}
                contentContainerStyle={styles(isDarkMode).listContainer}
            />
        </View>
    );
};

const styles = (isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? '#000' : '#FFF',
    },
    headerContainer: {
        backgroundColor: isDarkMode ? '#27262b' : '#FFF',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    listContainer: {
        paddingTop: 55,
    },
    profileIcon: {
        height: 35,
        width: 35,
        borderRadius: 25,
        resizeMode: 'cover',
        borderWidth: 3,
        borderColor: "#316ff6",
    },
    requestItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    requestInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    acceptButton: {
        backgroundColor: '#1877F2',
    },
    rejectButton: {
        backgroundColor: '#666',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '500',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});

export default FriendRequestScreen;