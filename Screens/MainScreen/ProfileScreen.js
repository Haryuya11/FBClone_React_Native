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
import Entypo from "@expo/vector-icons/Entypo";
import Home from "../../assets/svg/home_outline.svg";
import Post from "../../assets/svg/post_outline.svg";
import Video from "../../assets/svg/video_outline.svg";
import { UserContext } from "../../context/UserContext";
import PostComponent from "../../Components/PostComponent";
import PostCreationComponent from "../../Components/PostCreationComponent";
import * as postService from "../../services/postService";
import * as friendshipService from "../../services/friendshipService";
import * as userService from "../../services/userService";
import FriendButton from "../../Components/FriendButton";
import SettingIcon from "../../assets/svg/setting.svg";
import PencilIcon from "../../assets/svg/pencil.svg";
import ChatSolidIcon from "../../assets/svg/chat_solid.svg";
import Ionicons from "@expo/vector-icons/Ionicons";

const ProfileScreen = ({ route, navigation }) => {
    const { userProfile, logout } = useContext(UserContext);``
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
        <View style={styles.midContent}>
            {isOwnProfile ? (
                <>
                    <TouchableOpacity
                        style={styles.editProfileBtn}
                        onPress={() => navigation.navigate("EditProfile")}
                    >
                        <PencilIcon width={25} height={25} />
                        <Text style={styles.textEditProfileBtn}>Chỉnh sửa trang cá nhân</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingBtn} onPress={() => navigation.navigate("Setting")}>
                        <SettingIcon width={25} height={25} />
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity style={styles.chatBtn} onPress={handleMessage}>
                        <ChatSolidIcon width={22} height={22} />
                        <Text style={styles.textChatBtn}> Nhắn tin</Text>
                    </TouchableOpacity>
                    <FriendButton userId={userId} style={styles.editProfileBtn} onFriendshipChange={loadData} />
                </>
            )}
        </View>
    );

    const renderFriendItem = ({ item }) => (
        <TouchableOpacity
            style={styles.friendItem}
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
                style={styles.friendAvatar}
            />
            <Text style={styles.friendName} numberOfLines={1}>
                {`${item.first_name} ${item.last_name}`}
            </Text>
        </TouchableOpacity>
    );

    const navigationButtons = [
        { name: "Home", label: <Home width={35} height={35} /> },
        { name: "Video", label: <Video width={35} height={35} /> },
        { name: "FriendRequest", label: <Ionicons name="person-add-outline" size={35} color="black" /> },
        {
            name: "Profile",
            label: (
                <Image
                    source={{
                        uri: userProfile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
                    }}
                    style={styles.profileIcon}
                />
            ),
        },
    ];

    if (isLoading || !profile) {
        return <ActivityIndicator size="large" color="#316ff6" />;
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={posts}
                renderItem={({ item }) => <PostComponent post={item} onRefresh={handleRefresh} />}
                keyExtractor={(item) => item.id}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                ListHeaderComponent={
                    <>
                        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                        <View style={styles.headerContainer}>
                            <HeaderNavigationComponent
                                navigationButtons={navigationButtons}
                                onButtonPress={(name) => navigation.navigate(name)}
                                selectedButton="Profile"
                            />
                        </View>
                        <View style={styles.topContent}>
                            <Image
                                style={styles.backgroundImageProfile}
                                source={{
                                    uri: profile?.background_image || "https://t4.ftcdn.net/jpg/07/69/40/97/360_F_769409709_PjhFP5bP2AZVJinAEE4tAVKNkQVhQMpH.jpg",
                                }}
                            />
                            <View style={styles.avatarBox}>
                                <View style={styles.avatarContainer}>
                                    <View style={styles.borderAvatar}>
                                        <Image
                                            style={styles.avatar}
                                            source={{
                                                uri: profile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png',
                                            }}
                                        />
                                    </View>
                                </View>
                                <Text style={styles.userNameAvatarBox}>
                                    {profile ? `${profile.first_name} ${profile.last_name}` : "Loading..."}
                                </Text>
                            </View>
                        </View>
                        {renderActionButtons()}
                        <View style={styles.friendContainer}>
                            <View style={styles.friendHeader}>
                                <Text style={styles.friendTitle}>Bạn bè</Text>
                                <Text style={styles.numberOfFriends}>{friendCount} người bạn</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("FriendList", { userId })}
                                >
                                    <Text style={styles.friendSeeAll}>Xem tất cả</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={friends}
                                renderItem={renderFriendItem}
                                keyExtractor={(item) => item.id}
                                numColumns={3}
                                scrollEnabled={false}
                                contentContainerStyle={styles.friendList}
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
const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: "#fff",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    topContent: {
        marginBottom: 160,
    },
    avatarContainer: {
        height: 200,
        width: 200,
        backgroundColor: "white",
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
    },
    numberOfFriends: {
        fontStyle: "italic",
    },
    midContent: {
        marginBottom: 10,
        flex: 1,
        paddingHorizontal: 20,
        borderBottomWidth: 15,
        borderColor: "#CACED0",
        paddingBottom: 22,
        flexDirection: "row",
        justifyContent: "space-between",
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
        backgroundColor: "white",
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
    botContent: {},
    postBtnContainer: {
        flexDirection: "row",
        paddingLeft: 20,
        gap: 10,
        textAlign: "center",
        justifyContent: "flex-start",
        borderBottomColor: "gray",
        borderBottomWidth: 0.5,
        paddingBottom: 20,
    },
    postBtn: {
        borderColor: "#CCC",
        borderWidth: 0.5,
        paddingVertical: 7,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: "#EBF5FD",
        color: "gray",
        fontWeight: "500",
    },
    detail: {
        marginTop: 20,
        fontSize: 25,
        paddingLeft: 20,
        fontWeight: "bold",
    },
    detailContainer: {
        paddingLeft: 20,
        marginBottom: 20,
        padding: 10,
        borderBottomColor: "gray",
        borderBottomWidth: 0.5,
    },
    friendContainer: {
        paddingHorizontal: 20,
        borderBottomWidth: 15,
        borderColor: "#CACED0",
        paddingBottom: 20,
    },
    friendTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    friendSeeAll: {
        color: "#007bff",
        fontWeight: "bold",
        fontSize: 14,
    },
    friendList: {
        alignItems: "center",
    },
    friendItem: {
        flex: 1,
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
    },
    postBox: {
        borderBottomWidth: 15,
        borderColor: "#CACED0",
        padding: 20,
    },
    postBoxBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    avatarContainerPost: {
        height: 70,
        width: 70,
        backgroundColor: "white",
        borderRadius: 200,
        borderWidth: 0.6,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
    },
    borderAvatarPost: {
        height: "100%",
        width: "100%",
        borderRadius: 200,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarPost: {
        height: "100%",
        width: "100%",
    },
    post: {
        backgroundColor: "#fff",
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarInPost: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerText: {
        flexDirection: "column",
    },
    username: {
        fontWeight: "bold",
        fontSize: 16,
    },
    time: {
        color: "#888",
        fontSize: 12,
    },
    content: {
        marginVertical: 10,
        fontSize: 14,
    },
    postImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginInline: -15,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    actionText: {
        fontSize: 14,
        color: "black",
        marginLeft: 5,
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
        borderWidth: 3,
        borderColor: "#316ff6",
    },
});

export default ProfileScreen;
