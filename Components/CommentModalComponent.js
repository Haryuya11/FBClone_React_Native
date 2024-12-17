import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import Send from '../assets/svg/send.svg';
import LikeReaction from '../assets/svg/like_reaction.svg';
import { UserContext } from "../context/UserContext";
import NoComment from '../assets/svg/no_comment.svg';

const CommentModalComponent = ({ visible, onClose }) => {
    const [comments, setComments] = useState([]); // Danh sách comment
    const [newComment, setNewComment] = useState(''); // Comment mới
    const [replyCommentId, setReplyCommentId] = useState(null); // ID của comment đang trả lời

    const { userProfile } = useContext(UserContext);

    const handleAddComment = () => {
        if (newComment.trim()) {
            const newCommentData = {
                id: Date.now().toString(),
                text: newComment,
                user: (userProfile?.first_name || "") + " " + (userProfile?.last_name || ""),
                avatar: userProfile.avatar_url,
                like: 0,
                time: new Date().toLocaleTimeString(), // Thời gian comment hiện tại
                isLike: false,
                replies: [],
            };
            if (replyCommentId) {
                // Thêm reply vào comment gốc
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.id === replyCommentId
                            ? { ...comment, replies: [...comment.replies, newCommentData] }
                            : comment
                    )
                );
                setReplyCommentId(null); // Reset trạng thái reply
            } else {
                // Thêm comment mới vào list
                setComments([...comments, newCommentData]);
            }
            setNewComment('');
        }
    };

    const handleReply = (id) => {
        setReplyCommentId(id); // Đặt ID của bình luận đang được trả lời
    };

    const handleLikeComment = (id) => {
        const updateLikes = (commentsList) =>
            commentsList.map((comment) => {
                if (comment.id === id) {
                    return {
                        ...comment,
                        isLike: !comment.isLike,
                        like: comment.isLike ? comment.like - 1 : comment.like + 1,
                    };
                }
                if (comment.replies.length > 0) {
                    return {
                        ...comment,
                        replies: updateLikes(comment.replies), // Đệ quy 
                    };
                }
                return comment;
            });

        setComments((prevComments) => updateLikes(prevComments));
    };

    const CommentItem = ({ item }) => {
        const [isExpanded, setIsExpanded] = useState(false); // State xem thêm

        const toggleExpand = () => {
            setIsExpanded((prev) => !prev);
        };

        return (
            <View style={styles.commentItem}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.commentContent}>
                    <Text style={styles.userName}>{item.user}</Text>
                    <Text
                        style={[
                            styles.commentText,
                            !isExpanded && styles.collapsedText,
                        ]}
                        numberOfLines={isExpanded ? null : 4}
                    >
                        {item.text}
                    </Text>
                    {item.text.split("\n").length > 4 && (
                        <TouchableOpacity onPress={toggleExpand}>
                            <Text style={styles.expandButton}>
                                {isExpanded ? "Thu gọn" : "Xem thêm"}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles.commentFooter}>
                        <Text style={styles.commentTime}>{item.time}</Text>
                        <TouchableOpacity onPress={() => handleLikeComment(item.id)}>
                            <Text style={[
                                styles.likeButton,
                                item.isLike && styles.likeButtonActive,
                            ]}> Thích </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleReply(item.id)}>
                            <Text style={styles.replyButton}>Trả lời</Text>
                        </TouchableOpacity>
                        <View style={styles.likeContainer}>
                            {(item.like > 0) && (
                                <>
                                    <Text style={styles.likeCount}>{item.like}</Text>
                                    <LikeReaction width={22} height={19} />
                                </>
                            )
                            }
                        </View>
                    </View>
                    {/* Hiển thị reply */}
                    {item.replies.length > 0 && renderReplies(item.replies, item.id)}
                </View>
            </View>
        );
    };

    const renderCommentItem = ({ item }) => {
        return <CommentItem item={item} />;
    };

    const ReplyItem = ({ reply, parentId }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const toggleExpand = () => {
            setIsExpanded((prev) => !prev);
        };
        return (
            <View style={styles.replyItem}>
                <Image source={{ uri: reply.avatar }} style={styles.avatar} />
                <View style={styles.commentContent}>
                    <Text style={styles.userName}>{reply.user}</Text>
                    <Text
                        style={styles.commentText}
                        numberOfLines={isExpanded ? null : 4}
                    >
                        {reply.text}
                    </Text>
                    {reply.text.split("\n").length > 4 && (
                        <TouchableOpacity onPress={toggleExpand}>
                            <Text style={styles.expandButton}>
                                {isExpanded ? "Thu gọn" : "Xem thêm"}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles.commentFooter}>
                        <Text style={styles.commentTime}>{reply.time}</Text>
                        <TouchableOpacity onPress={() => handleLikeComment(reply.id)}>
                            <Text style={[
                                styles.likeButton,
                                reply.isLike && styles.likeButtonActive,
                            ]}> Thích </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleReply(parentId, reply.id)}>
                            <Text style={styles.replyButton}>Trả lời</Text>
                        </TouchableOpacity>
                        <View style={styles.likeContainer}>
                            {(reply.like > 0) && (
                                <>
                                    <Text style={styles.likeCount}>{reply.like}</Text>
                                    <LikeReaction width={22} height={19} />
                                </>
                            )
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    const renderReplies = (replies, parentId) => {
        return replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} parentId={parentId} />
        ));
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Bình luận</Text>
                {comments.length === 0 ? (
                    <View style={styles.noCommentContainer}>
                        <NoComment width={100} height={100} />
                        <Text style={styles.noCommentText}>Chưa có bình luận nào</Text>
                    </View>
                ) : (
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id}
                        renderItem={renderCommentItem}
                    />
                )}

                {/* Hiển thị trạng thái đang trả lời */}
                {replyCommentId && (
                    <View style={styles.replyingToContainer}>
                        <Text style={styles.replyingToText}>
                            Đang trả lời bình luận của: <Text style={styles.replyingToUser}>{
                                comments.find(comment => comment.id === replyCommentId)?.user
                            }</Text>
                        </Text>
                        <TouchableOpacity onPress={() => setReplyCommentId(null)}>
                            <Text style={styles.cancelReplyButton}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {/* Input comment */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={
                            replyCommentId ? 'Trả lời bình luận...' : 'Viết bình luận...'
                        }
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


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    commentItem: {
        flexDirection: 'row',
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
        fontWeight: 'bold',
        fontSize: 16,
    },
    commentText: {
        fontSize: 14,
        marginVertical: 5,
    },
    commentFooter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentTime: {
        fontSize: 12,
        color: '#888',
        marginRight: 15,
    },
    likeButton: {
        fontSize: 14,
        color: '#888',
        marginRight: 15,
    },
    likeButtonActive: {
        color: 'blue',
    },
    likeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    replyButton: {
        fontSize: 14,
        color: '#888',
    },
    replyItem: {
        flexDirection: 'row',
        marginTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    closeButton: {
        marginTop: 20,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: 'red',
    },
    replyingToContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingInline: 10,
        paddingBlockStart: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    replyingToText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    replyingToUser: {
        fontWeight: 'bold',
        color: '#007BFF',
    },
    cancelReplyButton: {
        fontSize: 14,
        color: 'red',
        marginLeft: 10,
    },
    noCommentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    noCommentText: {
        marginTop: 10,
        fontSize: 16,
        color: '#888',
    },
    expandButton: {
        color: '#888',
    },

});

export default CommentModalComponent;
