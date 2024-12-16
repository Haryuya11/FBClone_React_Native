// Tạm thời giống như Home
import React, { useState, useContext } from 'react';
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

// Chiều cao của Header
const HEADER_HEIGHT = 55;

const posts = [
    {
        id: '1',
        user: 'Nguyễn Tấn Cầm',
        content: 'de nhat tien si!',
        image: 'https://inseclab.uit.edu.vn/upload/2018/04/mrCam.png',
        avatar: 'https://nc.uit.edu.vn/wp-content/uploads/2022/11/80299-NguyenTanCam-Cam-Nguyen-Tan-272x300.jpg',
        time: '2 giờ trước',
        like: 9,
        comment: 0,
        share: 0,
    },
    {
        id: '2',
        user: 'Mr.Mewing',
        content: '50 years challenge!',
        image: 'https://i.ytimg.com/vi/Hlf18AIRg8Y/mqdefault.jpg',
        avatar: 'https://steamuserimages-a.akamaihd.net/ugc/2494510408099943078/F01916FFB56B797146821623A1E2811C03229A66/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
        time: '2 giờ trước',
        like: 6969,
        comment: 666,
        share: 1945,
    },
    {
        id: '3',
        user: 'Yi Long Ma',
        content: 'This is my new Tesla',
        image: 'https://www.mundodeportivo.com/files/image_449_220/files/fp/uploads/2021/12/17/61bd03fcb8ed6.r_d.493-271-5908.png',
        avatar: 'https://i1.sndcdn.com/avatars-XpzN0ujJa3iI96PS-hKizHQ-t1080x1080.jpg',
        time: '1 ngày trước',
        like: 30,
        comment: 0,
        share: 11,
    },
    {
        id: '4',
        user: 'Phạm Thế Sơn',
        content: 'Tôi yêu codeblock!',
        image: 'https://o.rada.vn/data/image/2020/09/15/codeblock-error.png',
        avatar: 'https://o.rada.vn/data/image/2020/09/15/codeblock-error.png',
        time: '1 ngày trước',
        like: 0,
        comment: 2,
        share: 1,
    },
];

const PostScreen = ({ navigation }) => {
    const { userProfile } = useContext(UserContext);
    
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


    // Làm basic tạm thời
    const renderPost = ({ item }) => (
        <View style={styles.post}>
            <View style={styles.header}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.headerText}>
                    <Text style={styles.username}>{item.user}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
            </View>

            <Text style={styles.content}>{item.content}</Text>

            <Image source={{ uri: item.image }} style={styles.postImage} />
            {(item.like > 0 || item.comment > 0 || item.share > 0) && (
                <View style={styles.reaction}>
                    {item.like > 0 && (
                        <View style={styles.reactionLike}>
                            <LikeReaction />
                            <Text>{item.like}</Text>
                        </View>
                    )}
                    {item.comment > 0 && (
                        <Text> {item.comment} bình luận</Text>
                    )}
                    {item.share > 0 && (
                        <Text style={styles.reactionComment}> {item.share} lượt chia sẻ</Text>
                    )}
                </View>
            )}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <AntDesign name="like2" size={24} color="black" />
                    <Text style={styles.actionText}>Thích</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome name="comment-o" size={24} color="black" />
                    <Text style={styles.actionText}>Bình luận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <SimpleLineIcons name="share" size={24} color="black" />
                    <Text style={styles.actionText}>Chia sẻ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

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
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
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
