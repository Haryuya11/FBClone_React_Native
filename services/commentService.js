import React from "react";
import { supabase } from "../lib/supabase";

export const getComments = async (postId) => {
  try {
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        parent_id,
        profiles!comments_user_id_fkey (
          id,
          first_name,
          last_name,
          avatar_url
        ),
        comment_likes (*)
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    // Chuyển đổi dữ liệu phẳng thành cấu trúc cây để tránh vòng lặp
    const transformComments = (comments) => {
      const commentMap = {};
      const rootComments = [];

      comments.forEach((comment) => {
        commentMap[comment.id] = {
          ...comment,
          replies: [],
        };
      });

      comments.forEach((comment) => {
        if (comment.parent_id) {
          commentMap[comment.parent_id]?.replies.push(commentMap[comment.id]);
        } else {
          rootComments.push(commentMap[comment.id]);
        }
      });

      return rootComments;
    };

    if (commentsError) {
      console.log("Bị lỗi khi lấy bình luận trong commentService", commentsError);
    }
    return transformComments(commentsData);
  } catch (error) {
    throw error;
  }
};

export const addComment = async (postId, userId, content, parentId = null) => {
  try {
    // Tạo comment mới
    const { data: newComment, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: userId,
        content: content,
        parent_id: parentId,
      })
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        parent_id,
        profiles!comments_user_id_fkey (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `
      )
      .single();

    if (error) throw error;

    // Chuyển đổi dữ liệu trước khi trả về
    const processedComment = {
      ...newComment,
      replies: [],
      user: {
        id: newComment.profiles.id,
        first_name: newComment.profiles.first_name,
        last_name: newComment.profiles.last_name,
        avatar_url: newComment.profiles.avatar_url,
      },
    };

    // Xóa profiles để tránh circular reference
    delete processedComment.profiles;

    return processedComment;
  } catch (error) {
    console.error("Bị lỗi khi thêm bình luận trong commentService", error);
    throw error;
  }
};

export const deleteComment = async (commentId, userId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", userId);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

export const toggleLikeComment = async (commentId, userId) => {
  try {
    const { data: existingLike } = await supabase
      .from("comment_likes")
      .select()
      .eq("comment_id", commentId)
      .eq("user_id", userId)
      .single();

    if (existingLike) {
      const { error } = await supabase
        .from("comment_likes")
        .delete()
        .eq("id", existingLike.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("comment_likes").insert({
        comment_id: commentId,
        user_id: userId,
      });

      if (error) throw error;
    }
  } catch (error) {
    throw error;
  }
};

export const subscribeToComments = (postId, callback) => {
  return supabase
    .channel(`public:comments:post_id=eq.${postId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "comments",
        filter: `post_id=eq.${postId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToCommentLikes = (commentId, callback) => {
  return supabase
    .channel(`public:comment_likes:comment_id=eq.${commentId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "comment_likes",
        filter: `comment_id=eq.${commentId}`,
      },
      callback
    )
    .subscribe();
};
