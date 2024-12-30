import React, { useRef, useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Animated,
    Easing,
} from 'react-native';
import HeaderNavigationComponent from '../../Components/HeaderNavigationComponent';
import Home from '../../assets/svg/home_blue.svg';
import Friend from '../../assets/svg/friend.svg';
import FriendDark from '../../assets/svg/darkmode/friend.svg';
import HomeDark from '../../assets/svg/darkmode/home_outline.svg';
import VideoDark from '../../assets/svg/darkmode/video_outline.svg';
import Video from '../../assets/svg/video_outline.svg';
import SearchDark from '../../assets/svg/darkmode/search.svg';
import ChatDark from '../../assets/svg/darkmode/chat.svg';
import Search from '../../assets/svg/search.svg';
import Chat from '../../assets/svg/chat.svg';
import PostComponent from '../../Components/PostComponent';
import PostCreationComponent from '../../Components/PostCreationComponent';
import { UserContext } from "../../context/UserContext";
import * as postService from "../../services/postService";
// Chiều cao của Header
const HEADER_HEIGHT = 100;

const HomeScreen = ({ navigation }) => {
    const { userProfile, isDarkMode, language } = useContext(UserContext);

    const [posts, setPosts] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadPosts = async () => {
        try {
            const postsData = await postService.getPosts();
            setPosts(postsData);
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadPosts();
        setIsRefreshing(false);
    };

    useEffect(() => {
        loadPosts();

        // Subscribe to all posts changes
        const subscription = postService.subscribeToPosts((payload) => {
            if (payload.eventType === 'INSERT') {
                setPosts(prev => [payload.new, ...prev]);
            } else if (payload.eventType === 'DELETE') {
                setPosts(prev => prev.filter(post => post.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
                setPosts(prev => prev.map(post =>
                    post.id === payload.new.id ? payload.new : post
                ));
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const [selectedButton, setSelectedButton] = useState('Home'); // State trang hiện tại

    const translateY = useRef(new Animated.Value(0)).current; // Animated value cho header
    const [previousScroll, setPreviousScroll] = useState(0);

    const animateHeader = (toValue) => {
        Animated.timing(translateY, {
            toValue,
            duration: 300, // 0.3s
            easing: Easing.out(Easing.quad), // Làm smooth
            useNativeDriver: true, // Dùng Native driver để tăng hiệu suất
        }).start();
    };

    const handleScroll = (event) => {
        const currentScroll = event.nativeEvent.contentOffset.y;

        if (currentScroll > previousScroll && currentScroll > 200) {
            // Cuộn xuống, ẩn header
            animateHeader(-HEADER_HEIGHT);
        } else if (currentScroll < previousScroll) {
            // Cuộn lên, hiện header
            animateHeader(0);
        }

        setPreviousScroll(currentScroll);
    };

    const handleButtonPress = (name) => {
        navigation.navigate(name);
        // Console log Navigation
    };

    // Biểu tượng trên Navigation
    const navigationButtons = [
        {name: 'Home', label: isDarkMode ? <HomeDark width={35} height={35} /> : <Home width={35} height={35} /> },
        {name: 'Video', label: isDarkMode ? <VideoDark width={35} height={35} /> : <Video width={35} height={35} /> },
        {name: 'FriendRequest', label: isDarkMode ? <FriendDark width={35} height={35} /> : <Friend width={35} height={35} />},
        {
            name: 'Profile', label: <Image source={{
                uri: userProfile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
            }} style={styles(isDarkMode).profileIcon} />
        },
    ];

    // Hàm xử lý khi bài viết mới được đăng
    const handlePostSubmit = (newPost) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]); // Thêm bài mới vào đầu danh sách
    };

    return (
        <View style={styles(isDarkMode).container}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={isDarkMode ? '#27262b' : '#FFF'}
            />
            <Animated.View
                style={[
                    styles(isDarkMode).headerContainer,
                    { transform: [{ translateY }] },
                ]}
            >
                <View style={styles(isDarkMode).headerTop}>
                    <Text style={styles(isDarkMode).appName}>Facenote</Text>
                    <View style={styles(isDarkMode).headerIcons}>
                        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                            {isDarkMode ? <SearchDark width={35} height={35} /> : <Search width={35} height={35} />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                        {isDarkMode ? <ChatDark width={30} height={30} /> : <Chat width={30} height={30} />}
                        </TouchableOpacity>
                    </View>
                </View>
                <HeaderNavigationComponent
                    navigationButtons={navigationButtons}
                    onButtonPress={(name) => navigation.navigate(name)}
                    selectedButton={selectedButton}
                />
            </Animated.View>
            <FlatList
                data={posts}
                renderItem={({ item }) => (
                    <PostComponent
                        post={item}
                        navigation={navigation}
                        onRefresh={handleRefresh}
                    />
                )}
                keyExtractor={(item) => item.id}
                onScroll={handleScroll}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                ListHeaderComponent={
                    <View style={styles(isDarkMode).newPost}>
                        <PostCreationComponent onPostSubmit={handlePostSubmit} />
                    </View>
                }
            />
        </View>
    );
};

const styles = (isDarkMode) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#000' : '#FFF',
        },
        headerContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            elevation: 5,
            paddingHorizontal: 10,
            height: HEADER_HEIGHT,
            backgroundColor: isDarkMode ? '#27262b' : '#FFF',
        },
        appName: {
            fontSize: 30,
            fontWeight: 'bold',
            color: isDarkMode ? 'white' : '#316ff6',
        },
        headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 50,
        },
        headerIcons: {
            flexDirection: 'row',
            gap: 20,
        },
        newPost: {
            paddingTop: 105,
        },
        profileIcon: {
            height: 35,
            width: 35,
            borderRadius: 25,
            resizeMode: 'cover',
        },
    });

export default HomeScreen;
