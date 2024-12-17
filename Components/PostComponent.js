import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, FlatList, TextInput, StyleSheet, Share } from 'react-native';
import LikeBlue from '../assets/svg/like_blue.svg';
import LikeOutline from '../assets/svg/like_outline.svg';
import LikeReaction from '../assets/svg/like_reaction.svg';
import Comment from '../assets/svg/comment.svg';
import ShareIcon from '../assets/svg/share.svg';
import CommentModalComponent from './CommentModalComponent';
import { Video } from 'expo-av';

const PostComponent = ({ post, setPosts }) => {
    const [isCommentVisible, setCommentVisible] = useState(false); // Trạng thái mở/đóng modal bình luận
    const [isExpanded, setExpanded] = useState(false); // Trạng thái xem thêm

    const handleLike = () => {
        setPosts((prevPosts) =>
            prevPosts.map((p) =>
                p.id === post.id
                    ? { ...p, isLike: !p.isLike, like: post.isLike ? post.like - 1 : post.like + 1 }
                    : p
            )
        );
    };

    // Hàm xử lý comment
    const handleComment = () => {
        setPosts((prevPosts) =>
            prevPosts.map((p) =>
                p.id === post.id ? { ...p, comment: post.comment + 1 } : p
            )
        );
        setCommentVisible(true);
    };

    // Hàm xử lý share
    const handleShare = async () => {
        try {
            const result = await Share.share({
                title: `Được chia sẻ từ Facenote`,
                message:
                    `${post.user} \n\n ${post.content}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log("activity type");
                } else {
                    // Nếu dùng android thì luôn mặc định là người dùng đã share dù dismiss
                    console.log("shared");

                    setPosts((prevPosts) =>
                        prevPosts.map((p) =>
                            p.id === post.id ? { ...p, share: post.share + 1 } : p
                        )
                    );
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
                console.log("User dismissed the share action");

            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    // Hàm xử lý xem thêm
    const toggleExpand = () => {
        setExpanded(!isExpanded);
    }

    return (
        /* Post info*/
        <View style={styles.post}>
            <View style={styles.header}>
                <Image source={{ uri: post.avatar }} style={styles.avatar} />
                <View style={styles.headerText}>
                    <Text style={styles.username}>{post.user}</Text>
                    <Text style={styles.time}>{post.time}</Text>
                </View>
            </View>

            {/* Content */}
            {post.content &&
                <Text
                    style={styles.content}
                    numberOfLines={isExpanded ? null : 5} ellipsizeMode='tail'
                >
                    {post.content}
                </Text>}
            {post.content.split("\n").length > 5 && (
                <TouchableOpacity onPress={toggleExpand}>
                    <Text style={styles.expandButton}>
                        {isExpanded ? "Thu gọn" : "Xem thêm"}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Post image */}
            {post.image && (
                <Image source={{ uri: post.image }} style={styles.postImage} />
            )}
            {post.video && (
                <Video
                    source={{ uri: post.video }}
                    style={styles.postVideo}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                />
            )}
            {/* Reaction */}
            {(post.like > 0 || post.comment > 0 || post.share > 0) && (
                <View style={styles.reaction}>
                    {post.like > 0 && (
                        <View style={styles.reactionLike}>
                            <LikeReaction />
                            <Text>{post.like}</Text>
                        </View>
                    )}
                    {post.comment > 0 && (
                        <Text style={styles.reactionComment}> {post.comment} bình luận</Text>
                    )}
                    {post.share > 0 && (
                        <Text style={styles.reactionShare}> {post.share} lượt chia sẻ</Text>
                    )}
                </View>
            )}
            {/* Modal hiển thị danh sách bình luận */}
            <CommentModalComponent
                visible={isCommentVisible}
                onClose={() => setCommentVisible(false)}
            />
            {/* Action button*/}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                    {post.isLike ? <LikeBlue width={28} height={28} /> : <LikeOutline width={28} height={28} />}
                    <Text style={styles.actionText}>Thích</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
                    <Comment width={28} height={28} />
                    <Text style={styles.actionText}>Bình luận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                    <ShareIcon width={28} height={28} />
                    <Text style={styles.actionText}>Chia sẻ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    postVideo: {
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
        height: 35,
    },

    reactionLike: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    reactionLike: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    reactionComment: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
    },
    reactionShare: {
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
    expandButton: {
        color: '#888',
    },

});


export default PostComponent;
