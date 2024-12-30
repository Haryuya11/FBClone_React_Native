import React, { useState, useContext, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import HeaderNavigationComponent from "../../Components/HeaderNavigationComponent";
import Home from "../../assets/svg/home_outline.svg";
import Video from "../../assets/svg/video_outline.svg";
import { UserContext } from "../../context/UserContext";
import PostComponent from "../../Components/PostComponent";
import PostCreationComponent from "../../Components/PostCreationComponent";
import * as postService from "../../services/postService";
import * as friendshipService from "../../services/friendshipService";
import * as userService from "../../services/userService";
import FriendButton from "../../Components/FriendButton";
import SettingIcon from "../../assets/svg/setting.svg";
import SettingIconDark from "../../assets/svg/darkmode/setting.svg";
import PencilIcon from "../../assets/svg/pencil.svg";
import ChatSolidIcon from "../../assets/svg/chat_solid.svg";
import HomeDark from '../../assets/svg/darkmode/home_outline.svg';
import VideoDark from '../../assets/svg/darkmode/video_outline.svg';
import Friend from '../../assets/svg/friend.svg';
import FriendDark from '../../assets/svg/darkmode/friend.svg';


const ProfileScreen = ({ route, navigation }) => {
    const { userProfile, logout, isDarkMode, language } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [friendCount, setFriendCount] = useState(0);
    const [friends, setFriends] = useState([]);

    const userId = route.params?.userId || userProfile?.id;
    const isOwnProfile = userId === userProfile?.id;

    // Load all necessary data in parallel
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [profileData, postsData, friendsList, friendCountData] = await Promise.all([
                userService.loadUserProfile(userId),
                postService.getPostsByUserId(userId),
                friendshipService.getFriendsList(userId),
                friendshipService.getFriendsCount(userId),
            ]);
            setProfile(profileData);
            setPosts(postsData.map((post) => ({ ...post, profiles: profileData })));
            setFriends(friendsList.slice(0, 6));
            setFriendCount(friendCountData);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) loadData();
    }, [userId, loadData]);

    // Real-time updates subscription
    useEffect(() => {
        if (!userId || !profile) return;

        const postSubscription = postService.subscribeToUserPosts(userId, async (payload) => {
            setPosts((prev) => {
                switch (payload.eventType) {
                    case "INSERT":
                        return [{ ...payload.new, profiles: profile }, ...prev];
                    case "DELETE":
                        return prev.filter((post) => post.id !== payload.old.id);
                    case "UPDATE":
                        return prev.map((post) =>
                            post.id === payload.new.id ? { ...payload.new, profiles: profile } : post
                        );
                    default:
                        return prev;
                }
            });
        });

        const friendshipSubscription = friendshipService.subscribeFriendships(userId, loadData);

        return () => {
            postSubscription?.unsubscribe();
            friendshipSubscription?.unsubscribe();
        };
    }, [userId, profile, loadData]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const handleMessage = () => {
        navigation.navigate("Chat", {
            screen: "DirectMessage",
            params: {
                user: {
                    id: profile.id,
                    name: `${profile.first_name} ${profile.last_name}`,
                    avatar: profile.avatar_url,
                }
            }
        });
    };

    const renderActionButtons = () => (
        <View style={styles(isDarkMode).midContent}>
            {isOwnProfile ? (
                <>
                    <TouchableOpacity
                        style={styles(isDarkMode).editProfileBtn}
                        onPress={() => navigation.navigate("EditProfile")}
                    >
                        <PencilIcon width={25} height={25} />
                        <Text style={styles(isDarkMode).textEditProfileBtn}>
                            {language === "vn" ? "Chỉnh sửa trang cá nhân" : "Change your profile"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles(isDarkMode).settingBtn} onPress={() => navigation.navigate("Setting")}>
                        {isDarkMode ? <SettingIconDark width={25} height={25} /> : <SettingIcon width={25} height={25} />}
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity style={styles(isDarkMode).chatBtn} onPress={handleMessage}>
                        <ChatSolidIcon width={22} height={22} />
                        <Text style={styles(isDarkMode).textChatBtn}> {language === "vn" ? "Nhắn tin" : "Message"}</Text>
                    </TouchableOpacity>
                    <FriendButton userId={userId} style={styles(isDarkMode).editProfileBtn} onFriendshipChange={loadData} />
                </>
            )}
        </View>
    );

    const renderFriendItem = ({ item }) => (
        <TouchableOpacity
            style={styles(isDarkMode).friendItem}
            onPress={() => {
                navigation.navigate("Profile", {
                    screen: 'ProfileScreen',
                    params: { userId: item.id },
                });
            }}
        >
            <Image
                source={{
                    uri: item?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
                }}
                style={styles(isDarkMode).friendAvatar}
            />
            <Text style={styles(isDarkMode).friendName} numberOfLines={1}>
                {`${item.first_name} ${item.last_name}`}
            </Text>
        </TouchableOpacity>
    );

    const navigationButtons = [
        { name: "Home", label: isDarkMode ? <HomeDark width={35} height={35} /> : <Home width={35} height={35} /> },
        { name: "Video", label: isDarkMode ? <VideoDark width={35} height={35} /> : <Video width={35} height={35} /> },
        { name: "FriendRequest", label: isDarkMode ? <FriendDark width={35} height={35} /> : <Friend width={35} height={35} /> },
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

    if (isLoading || !profile) {
        return <ActivityIndicator size="large" color="#316ff6" />;
    }

    return (
        <View style={styles(isDarkMode).container}>
            <FlatList
                data={posts}
                renderItem={({ item }) => <PostComponent post={item} onRefresh={handleRefresh} />}
                keyExtractor={(item) => item.id}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                ListHeaderComponent={
                    <>
                        <StatusBar
                            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                            backgroundColor={isDarkMode ? '#27262b' : '#FFF'}
                        />
                        <View style={styles(isDarkMode).headerContainer}>
                            <HeaderNavigationComponent
                                navigationButtons={navigationButtons}
                                onButtonPress={(name) => navigation.navigate(name)}
                                selectedButton="Profile"
                            />
                        </View>
                        <View style={styles(isDarkMode).topContent}>
                            <Image
                                style={styles(isDarkMode).backgroundImageProfile}
                                source={{
                                    uri: profile?.background_image || "https://t4.ftcdn.net/jpg/07/69/40/97/360_F_769409709_PjhFP5bP2AZVJinAEE4tAVKNkQVhQMpH.jpg",
                                }}
                            />
                            <View style={styles(isDarkMode).avatarBox}>
                                <View style={styles(isDarkMode).avatarContainer}>
                                    <View style={styles(isDarkMode).borderAvatar}>
                                        <Image
                                            style={styles(isDarkMode).avatar}
                                            source={{
                                                uri: profile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png',
                                            }}
                                        />
                                    </View>
                                </View>
                                <Text style={styles(isDarkMode).userNameAvatarBox}>
                                    {profile ? `${profile.first_name} ${profile.last_name}` : "Loading..."}
                                </Text>
                            </View>
                        </View>
                        {renderActionButtons()}
                        <View style={styles(isDarkMode).friendContainer}>
                            <View>
                                <View style={styles(isDarkMode).friendHeader}>
                                    <Text style={styles(isDarkMode).friendTitle}>{language === "vn" ? "Bạn bè" : "Friends"}</Text>
                                    <Text style={styles(isDarkMode).numberOfFriends}> ({friendCount} {language === "vn" ? "người bạn" : "friends"})
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("FriendList", { userId })}
                                >
                                    <Text style={styles(isDarkMode).friendSeeAll}>{language === "vn" ? "Xem tất cả" : "View all friends"}</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={friends}
                                renderItem={renderFriendItem}
                                keyExtractor={(item) => item.id}
                                numColumns={3}
                                scrollEnabled={false}
                                contentContainerStyle={styles(isDarkMode).friendList}
                            />
                        </View>
                        {isOwnProfile && (
                            <PostCreationComponent
                                onPostSubmit={(newPost) => setPosts((prev) => [newPost, ...prev])}
                                navigation={navigation}
                            />
                        )}
                    </>
                }
            />
        </View>
    );
};

const styles = (isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? "#27262b" : "#fff",
    },
    headerContainer: {
        backgroundColor: isDarkMode ? "#27262b" : "#fff",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    topContent: {
        marginBottom: 160,
        backgroundColor: isDarkMode ? "#27262b" : "#fff",
    },
    avatarContainer: {
        height: 200,
        width: 200,
        color: isDarkMode ? "#27262b" : "#fff",
        borderRadius: 200,
        borderWidth: 0.6,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
    },
    borderAvatar: {
        height: "100%",
        width: "100%",
        borderRadius: 200,
        alignItems: "center",
        justifyContent: "center",
        elevation: 10,
    },
    avatar: {
        height: "100%",
        width: "100%",
        borderRadius: 200,
    },
    userNameAvatarBox: {
        fontSize: 28,
        fontWeight: "bold",
        color: isDarkMode ? "white" : "black",
        backgroundColor: isDarkMode ? "#27262b" : "#fff",
    },
    midContent: {
        marginBottom: 10,
        flex: 1,
        paddingHorizontal: 20,
        borderBottomWidth: 5,
        borderColor: isDarkMode ? "#000" : "#CACED0",
        paddingBottom: 22,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: isDarkMode ? "#27262b" : "white",

    },
    editProfileBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#316ff6",
        borderRadius: 5,
        borderWidth: 0.5,
        paddingVertical: 10,
        paddingRight: 18,
        borderColor: "gray",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 8,
        justifyContent: "center",
        width: "85%",
    },
    textEditProfileBtn: {
        fontSize: 17,
        marginLeft: 10,
        color: "white",
        fontWeight: "bold",
    },
    settingBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isDarkMode ? "#444" : "white",
        borderRadius: 5,
        borderWidth: 0.5,
        paddingVertical: 10,
        borderColor: "gray",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 8,
        justifyContent: "center",
        width: "13%",
    },
    numberOfFriends: {
        color: isDarkMode ? "white" : "black",
        fontSize: 16,
    },
    chatBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#316ff6",
        borderRadius: 5,
        borderWidth: 0.5,
        paddingVertical: 10,
        borderColor: "gray",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 8,
        justifyContent: "center",
        width: "58%",
    },
    textChatBtn: {
        fontSize: 17,
        color: "white",
        fontWeight: "bold",
    },
    friendContainer: {
        paddingHorizontal: 20,
        borderBottomWidth: 5,
        borderColor: isDarkMode ? "#000" : "#CACED0",
        paddingBottom: 20,
        justifyContent: "left",
        alignItems: "left",
        alignSelf: "left",

    },
    friendTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: isDarkMode ? "white" : "black",
    },
    friendSeeAll: {
        color: "#007bff",
        fontWeight: "bold",
        fontSize: 16,
    },
    friendHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 3,
    },
    friendList: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "flex-start",

    },
    friendItem: {
        width: 110,
        margin: 5,
        alignItems: "center",
    },
    friendAvatar: {
        width: 110,
        height: 110,
        borderRadius: 10,
        marginBottom: 5,
    },
    friendName: {
        fontSize: 14,
        textAlign: "center",
        maxWidth: 80, // Giới hạn chiều rộng tên
        color: isDarkMode ? "white" : "black",
    },
    backgroundImageProfile: {
        width: "100%",
        height: 300,
    },
    avatarBox: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        height: 250,
        width: 400,
        marginTop: 200,
        marginLeft: 10,
    },
    profileIcon: {
        height: 40,
        width: 40,
        borderRadius: 25,
        resizeMode: "cover",
    }
});

export default ProfileScreen;
