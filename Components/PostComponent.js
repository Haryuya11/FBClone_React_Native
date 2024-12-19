import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import LikeBlue from "../assets/svg/like_blue.svg";
import LikeOutline from "../assets/svg/like_outline.svg";
import LikeReaction from "../assets/svg/like_reaction.svg";
import Comment from "../assets/svg/comment.svg";
import ShareIcon from "../assets/svg/share.svg";
import CommentModalComponent from "./CommentModalComponent";
import { ResizeMode, Video } from "expo-av";
import { UserContext } from "../context/UserContext";
import * as postService from "../services/postService";
import { supabase } from "../lib/supabase";
import { formatTimeAgo } from "../utils/dateUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
const getMediaUrl = (path) => {
  if (!path) return null;
  const {
    data: { publicUrl },
  } = supabase.storage.from("post-media").getPublicUrl(path);
  return publicUrl;
};

const PostComponent = ({ post: initialPost, onRefresh }) => {
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(initialPost);
  const [postUser, setPostUser] = useState(post?.profiles || null);
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái xem thêm
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaDimensions, setMediaDimensions] = useState({
    width: 0,
    height: 0,
  });
  const screenWidth = Dimensions.get("window").width;
  const maxHeight = Dimensions.get("window").height * 0.8; // 80% chiều cao màn hình
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async () => {
    Alert.alert(
      "Xóa bài viết",
      "Bạn có chắc chắn muốn xóa bài viết này không?",
      [
        {
          text: "Xóa",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await postService.deletePost(post.id, user.id);
              setShowOptionsModal(false);
              if (onRefresh) {
                onRefresh();
              }
            } catch (error) {
              alert("Không thể xóa bài viết. Vui lòng thử lại sau.");
              throw error;
            } finally {
              setIsDeleting(false);
            }
          },
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]
    );
  };

  // Tạo các biến computed
  const userLiked = useMemo(() => {
    return post?.post_likes?.some((like) => like.user_id === user.id) || false;
  }, [post?.post_likes, user.id]);

  const totalLikes = useMemo(() => {
    return post?.post_likes?.length || 0;
  }, [post?.post_likes]);

  const totalComments = useMemo(() => {
    const countAllComments = (comments) => {
      if (!comments) return 0;
      return comments.reduce((total, comment) => {
        // Đếm comment gốc
        let count = 1;
        // Đếm tất cả replies nếu có
        if (comment.replies && comment.replies.length > 0) {
          count += comment.replies.length;
        }
        return total + count;
      }, 0);
    };

    return countAllComments(post?.comments);
  }, [post?.comments]);

  useEffect(() => {
    if (post?.profiles) {
      setPostUser(post.profiles);
    }
  }, [post]);

  useEffect(() => {
    const postSubscription = postService.subscribeToPosts((payload) => {
      if (payload.new.id === post.id) {
        setPost((prev) => ({ ...prev, ...payload.new }));
      }
    });

    const likeSubscription = postService.subscribeToPostLikes(
      post.id,
      (payload) => {
        if (payload.eventType === "INSERT") {
          setPost((prevPost) => {
            const prevLikes = prevPost.post_likes || [];

            if (userLiked) {
              // Unlike: Xóa like của user hiện tại
              return {
                ...prevPost,
                post_likes: prevLikes.filter(
                  (like) => like.user_id !== user.id
                ),
              };
            } else {
              // Like: Thêm like mới
              return {
                ...prevPost,
                post_likes: [
                  ...prevLikes,
                  {
                    post_id: post.id,
                    user_id: user.id,
                    created_at: new Date().toISOString(),
                  },
                ],
              };
            }
          });
        } else if (payload.eventType === "DELETE") {
          setPost((prevPost) => {
            const prevLikes = prevPost.post_likes || [];

            if (userLiked) {
              return {
                ...prevPost,
                post_likes: prevLikes.filter(
                  (like) => like.user_id !== user.id
                ),
              };
            } else {
              return {
                ...prevPost,
                post_likes: [...prevLikes, payload.new],
              };
            }
          });
        }
      }
    );

    const commentSubscription = postService.subscribeToPostComments(
      post.id,
      async (payload) => {
        if (payload.comments) {
          setPost((prev) => ({
            ...prev,
            comments: payload.comments,
          }));
        }
      }
    );

    // Cleanup subscriptions
    return () => {
      postSubscription.unsubscribe();
      likeSubscription.unsubscribe();
      commentSubscription.unsubscribe();
    };
  }, [post.id]);

  useEffect(() => {
    if (!post?.post_media || post.post_media.length === 0) return;

    const media = post.post_media[0];
    if (!media) return;

    if (media.media_type === "video") {
      const videoHeight = (screenWidth * 9) / 16;
      setMediaDimensions({
        width: screenWidth,
        height: videoHeight,
      });
    } else if (media.media_url) {
      Image.getSize(
        getMediaUrl(media.media_url),
        (width, height) => {
          const dimensions = calculateDimensions(width, height);
          setMediaDimensions(dimensions);
        },
        (error) => {
          console.error("Error loading image:", error);
        }
      );
    }
  }, [post?.post_media]);

  useEffect(() => {
    if (post?.post_likes) {
    }
  }, [post?.post_likes, user.id]);

  // Hàm xử lý share
  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: `Được chia sẻ từ Facenote`,
        message: `${post.profiles.first_name} ${post.profiles.last_name} \n\n ${post.content}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("activity type");
        } else {
          // Nếu dùng android thì luôn mặc định là người dùng đã share dù dismiss
          console.log("shared");

          //   setPost((prevPosts) =>
          //     prevPosts.map((p) =>
          //       p.id === post.id ? { ...p, share: post.share + 1 } : p
          //     )
          //   );
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
    setIsExpanded(!isExpanded);
  };

  const handlePrevMedia = () => {
    if (!post?.post_media) return;
    setCurrentMediaIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : post.post_media.length - 1;
      setSelectedMedia(post.post_media[newIndex]);
      return newIndex;
    });
  };

  const handleNextMedia = () => {
    if (!post?.post_media) return;
    setCurrentMediaIndex((prev) => {
      const newIndex = prev < post.post_media.length - 1 ? prev + 1 : 0;
      setSelectedMedia(post.post_media[newIndex]);
      return newIndex;
    });
  };

  const calculateDimensions = (originalWidth, originalHeight) => {
    const ratio = screenWidth / originalWidth;
    const newHeight = originalHeight * ratio;

    if (newHeight > maxHeight) {
      const newRatio = maxHeight / originalHeight;
      return {
        width: originalWidth * newRatio,
        height: maxHeight,
      };
    }

    return {
      width: screenWidth,
      height: newHeight,
    };
  };

  const renderMedia = () => {
    if (!post?.post_media || post.post_media.length === 0) return null;

    const renderGridMedia = () => {
      switch (post.post_media.length) {
        case 1:
          const media = post.post_media[0];
          if (!media) return null;

          return (
            <TouchableOpacity
              style={[
                styles.mediaContainer,
                {
                  width: mediaDimensions.width,
                  height: mediaDimensions.height,
                  alignSelf: "center",
                },
              ]}
              onPress={() => {
                if (media) {
                  setSelectedMedia(media);
                  setCurrentMediaIndex(0);
                }
              }}
            >
              {media.media_type === "video" ? (
                <Video
                  source={{ uri: getMediaUrl(media.media_url) }}
                  style={[
                    styles.mediaItem,
                    {
                      width: mediaDimensions.width,
                      height: mediaDimensions.height,
                    },
                  ]}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={false}
                  useNativeControls
                  isLooping={false}
                />
              ) : (
                <Image
                  source={{ uri: getMediaUrl(media.media_url) }}
                  style={[
                    styles.mediaItem,
                    {
                      width: mediaDimensions.width,
                      height: mediaDimensions.height,
                    },
                  ]}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          );
        case 2:
          return (
            <View style={styles.gridContainer}>
              {post.post_media.map((media, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.mediaContainer, styles.twoGridMedia]}
                  onPress={() => {
                    setSelectedMedia(media);
                    setCurrentMediaIndex(index);
                  }}
                >
                  {renderMediaItem(media)}
                </TouchableOpacity>
              ))}
            </View>
          );
        case 3:
          return (
            <View style={styles.gridContainer}>
              <TouchableOpacity
                style={[styles.mediaContainer, styles.threeGridFirst]}
                onPress={() => {
                  setSelectedMedia(post.post_media[0]);
                  setCurrentMediaIndex(0);
                }}
              >
                {renderMediaItem(post.post_media[0])}
              </TouchableOpacity>
              <View style={styles.rightGrid}>
                {post.post_media.slice(1).map((media, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.mediaContainer, styles.threeGridOthers]}
                    onPress={() => {
                      setSelectedMedia(media);
                      setCurrentMediaIndex(index + 1);
                    }}
                  >
                    {renderMediaItem(media)}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        default:
          return (
            <View style={styles.gridContainer}>
              <TouchableOpacity
                style={[styles.mediaContainer, styles.fourGridFirst]}
                onPress={() => {
                  setSelectedMedia(post.post_media[0]);
                  setCurrentMediaIndex(0);
                }}
              >
                {renderMediaItem(post.post_media[0])}
              </TouchableOpacity>
              <View style={styles.rightGrid}>
                {post.post_media.slice(1, 4).map((media, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.mediaContainer, styles.fourGridOthers]}
                    onPress={() => {
                      setSelectedMedia(media);
                      setCurrentMediaIndex(index + 1);
                    }}
                  >
                    {renderMediaItem(media)}
                    {index === 2 && post.post_media.length > 4 && (
                      <View style={styles.moreOverlay}>
                        <Text style={styles.moreText}>
                          +{post.post_media.length - 4}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
      }
    };

    const renderMediaItem = (media) => {
      if (media.media_type === "video") {
        return (
          <Video
            source={{ uri: getMediaUrl(media.media_url) }}
            style={styles.mediaItem}
            resizeMode="cover"
            shouldPlay={false}
            useNativeControls
          />
        );
      }
      return (
        <Image
          source={{ uri: getMediaUrl(media.media_url) }}
          style={styles.mediaItem}
          resizeMode="cover"
        />
      );
    };

    return (
      <View>
        {renderGridMedia()}

        {selectedMedia && (
          <Modal
            visible={selectedMedia !== null}
            transparent={true}
            onRequestClose={() => {
              setSelectedMedia(null);
              setCurrentMediaIndex(0);
            }}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setSelectedMedia(null);
                  setCurrentMediaIndex(0);
                }}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              {post.post_media.length > 1 && (
                <>
                  <TouchableOpacity
                    style={[styles.navButton, styles.prevButton]}
                    onPress={handlePrevMedia}
                  >
                    <Text style={styles.navButtonText}>‹</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.navButton, styles.nextButton]}
                    onPress={handleNextMedia}
                  >
                    <Text style={styles.navButtonText}>›</Text>
                  </TouchableOpacity>

                  <View style={styles.mediaCounter}>
                    <Text style={styles.mediaCounterText}>
                      {currentMediaIndex + 1}/{post.post_media.length}
                    </Text>
                  </View>
                </>
              )}

              {selectedMedia.media_type === "video" ? (
                <Video
                  source={{ uri: getMediaUrl(selectedMedia.media_url) }}
                  style={styles.fullScreenMedia}
                  resizeMode="contain"
                  shouldPlay={true}
                  useNativeControls
                  isLooping
                />
              ) : (
                <Image
                  source={{ uri: getMediaUrl(selectedMedia.media_url) }}
                  style={styles.fullScreenMedia}
                  resizeMode="contain"
                />
              )}
            </View>
          </Modal>
        )}
      </View>
    );
  };

  const handleLike = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      await postService.toggleLikePost(post.id, user.id);

      setPost((prevPost) => {
        const prevLikes = prevPost.post_likes || [];

        if (prevLikes.some((like) => like.user_id === user.id)) {
          return {
            ...prevPost,
            post_likes: prevLikes.filter((like) => like.user_id !== user.id),
          };
        } else {
          return {
            ...prevPost,
            post_likes: [
              ...prevLikes,
              {
                post_id: post.id,
                user_id: user.id,
                created_at: new Date().toISOString(),
              },
            ],
          };
        }
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Subscription để theo dõi thay đổi likes từ users khác
  useEffect(() => {
    const subscription = postService.subscribeToPostLikes(
      post.id,
      (payload) => {
        if (
          payload.new?.user_id === user.id ||
          payload.old?.user_id === user.id
        ) {
          return;
        }

        setPost((prevPost) => {
          const prevLikes = prevPost.post_likes || [];

          if (payload.eventType === "INSERT") {
            return {
              ...prevPost,
              post_likes: [...prevLikes, payload.new],
            };
          } else if (payload.eventType === "DELETE") {
            return {
              ...prevPost,
              post_likes: prevLikes.filter(
                (like) => like.user_id !== payload.old.user_id
              ),
            };
          }
          return prevPost;
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [post.id, user.id]);

  const handleCommentPress = () => {
    setIsCommentModalVisible(true);
  };

  return (
    <View style={styles.post}>
      <View style={styles.header}>
        <Image
          source={{
            uri: postUser?.avatar_url || "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.username}>
            {postUser
              ? `${postUser.first_name} ${postUser.last_name}`
              : "Unknown User"}
          </Text>
          <View style={styles.postInfo}>
            <Text style={styles.time}>{formatTimeAgo(post.created_at)}</Text>
          </View>
        </View>
        {post.user_id === user.id && (
          <View style={styles.settingsBtn}>
            <Ionicons
              name="ellipsis-horizontal-outline"
              size={24}
              color="black"
              onPress={() => setShowOptionsModal(true)}
            />
          </View>
        )}
      </View>

      {/* Content */}
      {post.content && (
        <Text
          style={styles.content}
          numberOfLines={isExpanded ? null : 5}
          ellipsizeMode="tail"
        >
          {post.content}
        </Text>
      )}
      {post.content.split("\n").length > 5 && (
        <TouchableOpacity onPress={toggleExpand}>
          <Text style={styles.expandButton}>
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </Text>
        </TouchableOpacity>
      )}

      {renderMedia()}

      {/* Reaction counts */}
      <View style={styles.reactionBar}>
        <View style={styles.leftReactions}>
          {totalLikes > 0 && (
            <View style={styles.reactionCount}>
              <LikeReaction width={20} height={20} />
              <Text style={styles.reactionText}>{totalLikes}</Text>
            </View>
          )}
        </View>
        <View style={styles.rightReactions}>
          {totalComments > 0 && (
            <View style={styles.reactionCount}>
              <Comment width={20} height={20} />
              <Text style={styles.reactionText}>{totalComments} bình luận</Text>
            </View>
          )}
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Modal hiển thị danh sách bình luận */}
      <CommentModalComponent
        visible={isCommentModalVisible}
        onClose={() => setIsCommentModalVisible(false)}
        postId={post.id}
      />
      {/* Action button*/}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            userLiked && styles.actionButtonLiked,
            isUpdating && styles.actionButtonDisabled,
          ]}
          onPress={handleLike}
          disabled={isUpdating}
        >
          {userLiked ? (
            <LikeBlue width={28} height={28} />
          ) : (
            <LikeOutline width={28} height={28} />
          )}
          <Text
            style={[styles.actionText, userLiked && styles.actionTextLiked]}
          >
            Thích
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCommentPress}
        >
          <Comment width={28} height={28} />
          <Text style={styles.actionText}>Bình luận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <ShareIcon width={28} height={28} />
          <Text style={styles.actionText}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowOptionsModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    handleDeletePost();
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <ActivityIndicator color="red" />
                  ) : (
                    <>
                      <Ionicons name="trash-outline" size={24} color="red" />
                      <Text style={[styles.modalOptionText, { color: "red" }]}>
                        Xóa bài viết
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  settingsBtn: {
    position: "absolute",
    right: 10,
    top: 5,
  },
  headerText: {
    flexDirection: "column",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
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
  postVideo: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  reaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 5,
    height: 35,
  },

  reactionLike: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  reactionComment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  reactionShare: {},
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginInline: -10,
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
  expandButton: {
    color: "#888",
  },
  mediaContainer: {
    marginVertical: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  mediaItem: {
    width: "100%",
    height: "100%",
  },
  gridContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  singleMedia: {
    width: "100%",
    height: 300,
  },
  twoGridMedia: {
    flex: 1,
    height: 200,
    marginHorizontal: 1,
  },
  threeGridFirst: {
    width: "50%",
    height: 400,
    marginRight: 2,
  },
  threeGridOthers: {
    height: 199,
    marginBottom: 2,
  },
  rightGrid: {
    flex: 1,
  },
  fourGridFirst: {
    width: "50%",
    height: 400,
    marginRight: 2,
  },
  fourGridOthers: {
    height: 132,
    marginBottom: 2,
  },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  fullScreenMedia: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -25 }],
    width: 50,
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  navButtonText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  mediaCounter: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 15,
    zIndex: 1,
  },
  mediaCounterText: {
    color: "white",
    fontSize: 14,
  },
  postInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    color: "#65676B",
    fontSize: 12,
  },
  reactionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftReactions: {
    flex: 1,
  },
  rightReactions: {
    flex: 1,
    alignItems: "flex-end",
  },
  reactionCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  reactionText: {
    color: "#65676B",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#CED0D4",
    marginHorizontal: 12,
  },
  actionButtonLiked: {
    opacity: 1,
  },
  actionTextLiked: {
    color: "#1877F2",
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  deletePostBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
});

export default PostComponent;
