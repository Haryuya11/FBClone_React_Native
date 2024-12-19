import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import HeaderNavigationComponent from '../../Components/HeaderNavigationComponent';
import Home from '../../assets/svg/home_outline.svg'
import Post from '../../assets/svg/post_blue.svg'
import Video from '../../assets/svg/video_outline.svg'
import Profile from '../../assets/svg/profile_outline.svg'
import LikeReaction from '../../assets/svg/like_reaction.svg'
import { UserContext } from "../../context/UserContext";
import PostComponent from '../../Components/PostComponent';
import * as postService from "../../services/postService";

const HEADER_HEIGHT = 55;


const PostScreen = ({ navigation }) => {
    const { userProfile } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadPosts = async () => {
        try {
            const postsData = await postService.getPostsByMediaType('image');
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
    }, []);

    const [selectedButton, setSelectedButton] = useState('Post'); // State trang hiện tại

    const handleButtonPress = (name) => {
        console.log(name);
        navigation.navigate(name);
        // Console log Navigation
    };

    // Biểu tượng trên Navigation
    const navigationButtons = [
        { name: 'Home', label: <Home width={35} height={35} /> },
        { name: 'Post', label: <Post width={35} height={35} /> },
        { name: 'Video', label: <Video width={35} height={35} /> },
        { name: 'Profile', label: <Image source={{ uri: userProfile.avatar_url }} style={styles.profileIcon} /> },
    ];

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.headerContainer}>
                {/* Header Navigation Component */}
                <HeaderNavigationComponent
                    navigationButtons={navigationButtons}
                    onButtonPress={handleButtonPress}
                    selectedButton={selectedButton}
                />
            </View>
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
                contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
                refreshing={isRefreshing}
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
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#fff',
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
    post: {
        backgroundColor: '#fff',
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerText: {
        flexDirection: 'column',
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    time: {
        color: '#888',
        fontSize: 12,
    },
    content: {
        marginVertical: 10,
        fontSize: 14,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
    },
    reaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 5,
        height: 25,
    },
    reactionComment: {
        marginInlineStart: -85,
    },
    reactionLike: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginInline: -10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    actionText: {
        fontSize: 14,
        color: 'black',
        marginLeft: 5,
    },
    profileIcon: {
        height: 35,
        width: 35,
        borderRadius: 25,
        resizeMode: 'cover',
    }
});

export default PostScreen;
