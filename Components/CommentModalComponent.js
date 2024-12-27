import React, { useState, useContext, useEffect, useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Image,
    ActivityIndicator,
} from "react-native";
import Send from "../assets/svg/send.svg";
import LikeReaction from "../assets/svg/like_reaction.svg";
import { UserContext } from "../context/UserContext";
import NoComment from "../assets/svg/no_comment.svg";
import { formatTimeAgo } from "../utils/dateUtils";
import * as commentService from "../services/commentService";
import { useNavigation } from '@react-navigation/native';

const CommentModalComponent = ({ visible, onClose, postId }) => {
    const navigation = useNavigation();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyCommentId, setReplyCommentId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { userProfile, isDarkMode, language } = useContext(UserContext);

    useEffect(() => {
        if (visible && postId) {
            loadComments();

            const commentsSubscription = commentService.subscribeToComments(
                postId,
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        loadComments();
                    } else if (payload.eventType === "DELETE") {
                        loadComments();
                    }
                }
            );

            return () => {
                commentsSubscription.unsubscribe();
            };
        }
    }, [visible, postId]);



    useEffect(() => {
        if (visible && postId && comments.length > 0) {
            const likeSubscription = comments
                .map((comment) => {
                    const rootComment = commentService.subscribeToCommentLikes(
                        comment.id,
                        (payload) => {
                            if (payload.eventType === "INSERT") {
                                loadComments();
                            } else if (payload.eventType === "DELETE") {
                                loadComments();
                            }
                        }
                    );

                    const replyComments = (comment.replies || []).map((reply) =>
                        commentService.subscribeToCommentLikes(reply.id, (payload) => {
                            if (payload.eventType === "INSERT") {
                                loadComments();
                            } else if (payload.eventType === "DELETE") {
                                loadComments();
                            }
                        })
                    );

                    return [rootComment, ...replyComments];
                })
                .flat();

            return () => {
                likeSubscription.forEach((subscription) => {
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                });
            };
        }
    }, [visible, postId, comments.length]);

    const loadComments = async () => {
        try {
            setIsLoading(true);
            const data = await commentService.getComments(postId);
            const processedComments = data.map((comment) => ({
                ...comment,
                replies: (comment.replies || []).map((reply) => ({
                    ...reply,
                    user: {
                        id: reply.profiles?.id,
                        first_name: reply.profiles?.first_name,
                        last_name: reply.profiles?.last_name,
                        avatar_url: reply.profiles?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png',
                    },
                })),
                user: {
                    id: comment.profiles?.id,
                    first_name: comment.profiles?.first_name,
                    last_name: comment.profiles?.last_name,
                    avatar_url: comment.profiles?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png',
                },
            }));
            setComments(processedComments);
        } catch (error) {
            console.error("Error loading comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const comment = await commentService.addComment(
                postId,
                userProfile.id,
                newComment.trim(),
                replyCommentId
            );

            const processedComment = {
                ...comment,
                user: {
                    id: userProfile.id,
                    first_name: userProfile.first_name,
                    last_name: userProfile.last_name,
                    avatar_url: userProfile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png',
                },
                replies: [],
            };

            if (replyCommentId) {
                setComments((prevComments) =>
                    prevComments.map((c) => {
                        if (c.id === replyCommentId) {
                            return {
                                ...c,
                                replies: [...(c.replies || []), processedComment],
                            };
                        }
                        return c;
                    })
                );
            } else {
                setComments((prevComments) => [...prevComments, processedComment]);
            }

            setNewComment("");
            setReplyCommentId(null);
        } catch (error) {
            console.error(
                "Bị lỗi khi thêm bình luận trong commentService",
                error.message
            );
            alert("Không thể thêm bình luận");
        }
    };
    const handleReply = (commentId, parentCommentId = null) => {
        // Nếu có parentCommentId, nghĩa là đang reply một comment con
        const targetCommentId = parentCommentId || commentId;
        const commentToReply = comments.find((c) => {
            // Tìm trong comment gốc
            if (c.id === commentId) return true;
            // Tìm trong replies
            if (c.id === parentCommentId) {
                return c.replies.some((reply) => reply.id === commentId);
            }
            return false;
        });

        if (commentToReply) {
            setReplyCommentId(targetCommentId); // Luôn set về comment gốc
            setNewComment(
                `@${commentToReply.user.first_name} ${commentToReply.user.last_name} `
            );
        }
    };

    const handleLikeComment = async (commentId, parentCommentId = null) => {
        try {
            await commentService.toggleLikeComment(commentId, userProfile.id);

            setComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment.id === commentId) {
                        const userLiked = comment.comment_likes?.some(
                            (like) => like.user_id === userProfile.id
                        );
                        return {
                            ...comment,
                            comment_likes: userLiked
                                ? comment.comment_likes.filter(
                                    (like) => like.user_id !== userProfile.id
                                )
                                : [
                                    ...(comment.comment_likes || []),
                                    {
                                        user_id: userProfile.id,
                                        created_at: new Date().toISOString(),
                                    },
                                ],
                        };
                    }
                    if (comment.id === parentCommentId) {
                        return {
                            ...comment,
                            replies: comment.replies.map((reply) => {
                                if (reply.id === commentId) {
                                    const userLiked = reply.comment_likes?.some(
                                        (like) => like.user_id === userProfile.id
                                    );
                                    return {
                                        ...reply,
                                        comment_likes: userLiked
                                            ? reply.comment_likes.filter(
                                                (like) => like.user_id !== userProfile.id
                                            )
                                            : [
                                                ...(reply.comment_likes || []),
                                                {
                                                    user_id: userProfile.id,
                                                    created_at: new Date().toISOString(),
                                                },
                                            ],
                                    };
                                }
                                return reply;
                            }),
                        };
                    }
                    return comment;
                })
            );
        } catch (error) {
            throw error;
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentService.deleteComment(commentId, userProfile.id);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
        } catch (error) {
            throw error;
        }
    };

    const handleAvatarPress = (userId) => {
        navigation.navigate('Profile', {
            screen: 'ProfileScreen',
            params: {
                userId: userId
            }
        });
    };

    const CommentItem = ({ item }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const [isTruncated, setIsTruncated] = useState(false);


        const userLiked = useMemo(
            () =>
                Array.isArray(item.comment_likes) &&
                item.comment_likes.some((like) => like.user_id === userProfile.id),
            [item.comment_likes, userProfile.id]
        );

        return (
            <View style={styles(isDarkMode).commentItem}>
                <TouchableOpacity
                    onPress={() => handleAvatarPress(item.user?.id)}
                >
                    <Image
                        source={{ uri: item.user?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png' }}
                        style={styles(isDarkMode).avatar}
                    />
                </TouchableOpacity>
                <View style={styles(isDarkMode).commentContent}>
                    <Text style={styles(isDarkMode).userName}>
                        {`${item.user?.first_name} ${item.user?.last_name}`}
                    </Text>
                    <Text
                        style={[styles(isDarkMode).commentText, !isExpanded && styles(isDarkMode).collapsedText]}
                        numberOfLines={isExpanded ? null : 4}
                        onTextLayout={(e) => {
                            const { lines } = e.nativeEvent;
                            setIsTruncated(lines.length > 4);
                        }}
                    >
                        {item.content.startsWith("@") ? (
                            <>
                                <Text style={styles(isDarkMode).replyingToUser}>
                                    {item.content.split(" ").slice(0, 2).join(" ")}
                                </Text>
                                <Text> {item.content.split(" ").slice(2).join(" ")}</Text>
                            </>
                        ) : (
                            item.content
                        )}
                    </Text>
                    {isTruncated && (
                        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                            <Text style={styles(isDarkMode).expandButton}>
                                {isExpanded ? "Thu gọn" : "Xem thêm"}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles(isDarkMode).commentFooter}>
                        <Text style={styles(isDarkMode).commentTime}>
                            {formatTimeAgo(item.created_at)}
                        </Text>
                        <TouchableOpacity onPress={() => handleLikeComment(item.id)}>
                            <Text
                                style={[
                                    styles(isDarkMode).likeButton,
                                    userLiked && styles(isDarkMode).likeButtonActive,
                                ]}
                            >
                                {language === "vn" ? "Thích" : "Like"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleReply(item.id)}>
                            <Text style={styles(isDarkMode).replyButton}>{language === "vn" ? "Trả lời" : "Reply"}</Text>
                        </TouchableOpacity>
                        {item.comment_likes?.length > 0 && (
                            <View style={styles(isDarkMode).likeContainer}>
                                <Text style={styles(isDarkMode).likeCount}>
                                    {item.comment_likes.length}
                                </Text>
                                <LikeReaction width={22} height={19} />
                            </View>
                        )}
                    </View>
                    {item.replies?.length > 0 && (
                        <View style={styles(isDarkMode).repliesContainer}>
                            {item.replies.map((reply) => {
                                // Kiểm tra kỹ hơn cho reply likes
                                const replyUserLiked =
                                    Array.isArray(reply.comment_likes) &&
                                    reply.comment_likes.some(
                                        (like) => like.user_id === userProfile.id
                                    );

                                return (
                                    <View key={reply.id} style={styles(isDarkMode).commentItem}>
                                        <Image
                                            source={{ uri: reply.user?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png' }}
                                            style={styles(isDarkMode).avatar}
                                        />
                                        <View style={styles(isDarkMode).commentContent}>
                                            <Text style={styles(isDarkMode).userName}>
                                                {`${reply.user?.first_name} ${reply.user?.last_name}`}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles(isDarkMode).commentText,
                                                    !isExpanded && styles(isDarkMode).collapsedText,
                                                ]}
                                                numberOfLines={isExpanded ? null : 4}
                                            >
                                                {reply.content.startsWith("@") ? (
                                                    <>
                                                        <Text style={styles(isDarkMode).replyingToUser}>
                                                            {reply.content.split(" ").slice(0, 2).join(" ")}
                                                        </Text>
                                                        <Text>
                                                            {" "}
                                                            {reply.content.split(" ").slice(2).join(" ")}
                                                        </Text>
                                                    </>
                                                ) : (
                                                    reply.content
                                                )}
                                            </Text>
                                            <View style={styles(isDarkMode).commentFooter}>
                                                <Text style={styles(isDarkMode).commentTime}>
                                                    {formatTimeAgo(reply.created_at)}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => handleLikeComment(reply.id, item.id)}
                                                >
                                                    <Text
                                                        style={[
                                                            styles(isDarkMode).likeButton,
                                                            replyUserLiked && styles(isDarkMode).likeButtonActive,
                                                        ]}
                                                    >
                                                        {language === "vn" ? "Thích" : "Like"}
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleReply(reply.id, item.id)}
                                                >
                                                    <Text style={styles(isDarkMode).replyButton}>{language === "vn" ? "Trả lời" : "Reply"}</Text>
                                                </TouchableOpacity>
                                                {Array.isArray(reply.comment_likes) &&
                                                    reply.comment_likes.length > 0 && (
                                                        <View style={styles(isDarkMode).likeContainer}>
                                                            <Text style={styles(isDarkMode).likeCount}>
                                                                {reply.comment_likes.length}
                                                            </Text>
                                                            <LikeReaction width={22} height={19} />
                                                        </View>
                                                    )}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles(isDarkMode).modalContainer}>
                <Text style={styles(isDarkMode).modalTitle}>{language === "vn" ? "Bình luận" : "Comment"}</Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : comments.length === 0 ? (
                    <View style={styles(isDarkMode).noCommentContainer}>
                        <NoComment width={100} height={100} />
                        <Text style={styles(isDarkMode).noCommentText}>{language === "vn" ? "Chưa có bình luận nào" : "No comment in here yet"}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <CommentItem item={item} />}
                    />
                )}

                {replyCommentId && (
                    <View style={styles(isDarkMode).replyingToContainer}>
                        <Text style={styles(isDarkMode).replyingToText}>
                        {language === "vn" ? "Đang trả lời bình luận của" : "Replying to"}{" "}
                            <Text style={styles(isDarkMode).replyingToUser}>
                                {
                                    comments.find((c) => c.id === replyCommentId)?.user
                                        ?.first_name
                                }{" "}
                                {comments.find((c) => c.id === replyCommentId)?.user?.last_name}
                            </Text>
                        </Text>
                        <TouchableOpacity onPress={() => setReplyCommentId(null)}>
                            <Text style={styles(isDarkMode).cancelReplyButton}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles(isDarkMode).inputContainer}>
                    <Image source={{
                        uri: userProfile?.avatar_url || 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
                    }} style={styles(isDarkMode).avatar} />
                    <TextInput
                        style={styles(isDarkMode).input}
                        placeholder={
                            replyCommentId
                                ? (language === "vn" ? "Trả lời bình luận..." : "Reply to...")
                                : (language === "vn" ? "Viết bình luận..." : "Write your comment")
                        }
                        placeholderTextColor={isDarkMode ? "#fff" : "#888"}
                        value={newComment}
                        onChangeText={setNewComment}
                        multiline
                    />
                    <TouchableOpacity onPress={handleAddComment}>
                        <Send width={35} height={35} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = (isDarkMode) =>
    StyleSheet.create({
        modalContainer: {
            flex: 1,
            padding: 20,
            backgroundColor: isDarkMode ? "#27262b" : "#fff",
        },
        modalTitle: {
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
            color: isDarkMode ? "#fff" : "#000",
        },
        commentItem: {
            flexDirection: "row",
            marginBottom: 15,
            
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
        },
        commentContent: {
            flex: 1,
        },
        userName: {
            fontWeight: "bold",
            fontSize: 18,
            color: isDarkMode ? "#fff" : "#000",
        },
        commentText: {
            fontSize: 16,
            marginVertical: 5,
            color: isDarkMode ? "#fff" : "#000",
        },
        commentFooter: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
        },
        commentTime: {
            fontSize: 12,
            color: "#888",
            marginRight: 15,
        },
        likeButton: {
            fontSize: 14,
            color: "#888",
            marginRight: 15,
        },
        likeCount: {
            color: isDarkMode ? "#888" : "#000",
        },
        likeButtonActive: {
            color: "blue",
        },
        likeContainer: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
        },
        replyButton: {
            fontSize: 14,
            color: "#888",
        },
        replyItem: {
            flexDirection: "row",
            marginTop: 10,
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
        },
        input: {
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            color: isDarkMode ? "#fff" : "#888",
        },
        closeButton: {
            marginTop: 20,
            alignSelf: "center",
        },
        closeButtonText: {
            color: "red",
        },
        replyingToContainer: {
            flexDirection: "row",
            alignItems: "center",
            paddingInline: 10,
            paddingBlockStart: 10,
            backgroundColor: isDarkMode ? "#27262b" : "#f9f9f9",
            color: isDarkMode ? "#fff" : "#888",
            borderRadius: 5,
        },
        replyingToText: {
            flex: 1,
            fontSize: 16,
            color: isDarkMode ? "#fff" : "#333",
        },
        replyingToUser: {
            fontWeight: "bold",
            color: "#007BFF",
        },
        cancelReplyButton: {
            fontSize: 18,
            color: "red",
            marginLeft: 10,
        },
        noCommentContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
        },
        noCommentText: {
            marginTop: 10,
            fontSize: 20,
            color: "#888",
        },
        expandButton: {
            color: "#888",
        },
        repliesContainer: {
            marginTop: 10,
        },
    });

export default CommentModalComponent;
