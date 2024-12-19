import React, {useRef, useState, useContext, useEffect, useCallback} from 'react';
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
import Home from '../../assets/svg/home_blue.svg'
import Post from '../../assets/svg/post_outline.svg'
import Video from '../../assets/svg/video_outline.svg'
import Search from '../../assets/svg/search.svg'
import Chat from '../../assets/svg/chat.svg'
import PostComponent from '../../Components/PostComponent';
import PostCreationComponent from '../../Components/PostCreationComponent';
import {UserContext} from "../../context/UserContext";
import * as postService from "../../services/postService";

// Chiều cao của Header
const HEADER_HEIGHT = 100;

const HomeScreen = ({navigation}) => {
    const {userProfile} = useContext(UserContext);

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
        {name: 'Home', label: <Home width={35} height={35}/>},
        {name: 'Post', label: <Post width={35} height={35}/>},
        {name: 'Video', label: <Video width={35} height={35}/>},
        {
            name: 'Profile', label: <Image source={{
                uri: userProfile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
            }} style={styles.profileIcon}/>
        },
    ];

    // Hàm xử lý khi bài viết mới được đăng
    const handlePostSubmit = (newPost) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]); // Thêm bài mới vào đầu danh sách
    };

    return (
        <View style={{flex: 1}}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff"/>

            {/* Header Animated */}
            <Animated.View
                style={[
                    styles.headerContainer,
                    {transform: [{translateY}]},
                ]}
            >
                <View style={styles.headerTop}>
                    <Text style={styles.appName}>Facenote</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity>
                            <Search width={35} height={35}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                            <Chat width={35} height={35}/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Header Navigation Component */}
                <HeaderNavigationComponent
                    navigationButtons={navigationButtons}
                    onButtonPress={handleButtonPress}
                    selectedButton={selectedButton}
                />
            </Animated.View>

            {/* Post List */}
            <FlatList
                data={posts}
                renderItem={({item}) => (
                    <PostComponent
                        post={item}
                        onRefresh={handleRefresh}
                    />
                )}
                keyExtractor={(item) => item.id}
                onScroll={handleScroll}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                // Component tạo bài viết
                ListHeaderComponent={
                    <View style={styles.newPost}>
                        <PostCreationComponent onPostSubmit={handlePostSubmit} navigation={navigation}/>
                    </View>
                }
            />
        </View>
    );
};
const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#fff',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        elevation: 5,
        paddingHorizontal: 10,
        height: HEADER_HEIGHT,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
    },
    appName: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'blue',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 20,
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 50,
    },
    headerButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    headerButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    newPost: {
        paddingTop: 105,
    },
    profileIcon: {
        height: 35,
        width: 35,
        borderRadius: 25,
        resizeMode: 'cover',
    }
});

export default HomeScreen;
