import { supabase } from "../lib/supabase";

export const getPosts = async () => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles:user_id (*),
        post_media (*),
        post_likes (*),
        comments (*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      alert("Có lỗi xảy ra khi lấy bài viết", error.message);
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const createPost = async (
  userId,
  content,
  medias,
  privacy = "public"
) => {
  try {
    const mediaFiles = [];
    if (medias && medias.length > 0) {
      for (const media of medias) {
        try {
          const fileExt = media.uri.split(".").pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${userId}/${fileName}`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage.from("post-media").upload(
              filePath,
              {
                uri: media.uri,
                type: media.type,
                name: fileName,
              },
              {
                contentType: media.type,
                upsert: false,
              }
            );

          if (uploadError) {
            console.error("Upload error:", uploadError.message);
            throw uploadError;
          }

          mediaFiles.push({
            media_url: uploadData.path,
            media_type: media.type.startsWith("image") ? "image" : "video",
          });
        } catch (mediaError) {
          console.error("Error processing media:", mediaError);
          throw mediaError;
        }
      }
    }

    // Create post
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        content,
        privacy,
      })
      .select()
      .single();

    if (postError) throw postError;

    // Add media files to post
    if (mediaFiles.length > 0) {
      const { error: mediaError } = await supabase.from("post_media").insert(
        mediaFiles.map((file) => ({
          post_id: postData.id,
          ...file,
        }))
      );

      if (mediaError) throw mediaError;
    }

    return postData;
  } catch (error) {
    console.error("Create post error:", error.message);
    console.error("Detailed error:", error.message);
    throw error;
  }
};

export const updatePost = async (postId, userId, content, newMedias = [], existingMediaPaths = []) => {
  try {
    // Upload new media files
    const mediaFiles = [];
    if (newMedias && newMedias.length > 0) {
      for (const media of newMedias) {
        const fileExt = media.uri.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("post-media")
          .upload(filePath, {
            uri: media.uri,
            type: media.type,
            name: fileName,
          });

        if (uploadError) throw uploadError;

        mediaFiles.push({
          media_url: uploadData.path,
          media_type: media.type.startsWith("image") ? "image" : "video",
        });
      }
    }

    // Delete media files that are not in existingMediaPaths
    const { data: currentMedia } = await supabase
      .from("post_media")
      .select("*")
      .eq("post_id", postId);

    for (const media of currentMedia || []) {
      if (!existingMediaPaths.includes(media.media_url)) {
        // Delete from storage
        await supabase.storage
          .from("post-media")
          .remove([media.media_url]);
        
        // Delete from database
        await supabase
          .from("post_media")
          .delete()
          .eq("id", media.id);
      }
    }

    // Update post content
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .update({ content })
      .eq("id", postId)
      .eq("user_id", userId)
      .select()
      .single();

    if (postError) throw postError;

    // Add new media files
    if (mediaFiles.length > 0) {
      const { error: mediaError } = await supabase
        .from("post_media")
        .insert(mediaFiles.map(file => ({
          post_id: postId,
          ...file
        })));

      if (mediaError) throw mediaError;
    }

    // Get updated post with all media
    const { data: updatedPost, error: fetchError } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:user_id (*),
        post_media (*),
        post_likes (*),
        comments (*)
      `)
      .eq("id", postId)
      .single();

    if (fetchError) throw fetchError;

    return updatedPost;
  } catch (error) {
    console.error("Update post error:", error);
    throw error;
  }
};

export const deletePost = async (postId, userId) => {
  try {
    const { data: mediaData, error: mediaError } = await supabase
      .from("post_media")
      .select("media_url")
      .eq("post_id", postId);

    if (mediaError) {
      alert("Có lỗi xảy ra khi xóa bài viết", mediaError.message);
      throw mediaError;
    }

    if (mediaData && mediaData.length > 0) {
      for (const media of mediaData) {
        const filePath = media.media_url.split("/").pop();
        const { error: deleteError } = await supabase.storage
          .from("post-media")
          .remove([filePath]);

        if (deleteError) {
          alert(
            "Có lỗi xảy ra khi xóa các file ảnh/video của bài viết",
            deleteError.message
          );
          throw deleteError;
        }
      }
    }

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId);

    if (postError) {
      alert("Có lỗi xảy ra khi xóa bài viết", postError.message);
      throw postError;
    }
  } catch (error) {
    throw error;
  }
};

export const toggleLikePost = async (postId, userId) => {
  try {
    // Kiểm tra xem đã like chưa
    const { data: isLiked, error: checkError } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (isLiked) {
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      return {
        action: "unlike",
        success: true,
      };
    } else {
      const { error: insertError } = await supabase.from("post_likes").insert([
        {
          post_id: postId,
          user_id: userId,
        },
      ]);

      if (insertError) throw insertError;

      return {
        action: "like",
        success: true,
      };
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    throw error;
  }
};

export const subscribeToPosts = (callback) => {
  return supabase
    .channel("public:posts")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "posts",
      },
      callback
    )
    .subscribe();
};

export const subscribeToPostLikes = (postId, callback) => {
  return supabase
    .channel(`public:post_likes:post_id=eq.${postId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "post_likes",
        filter: `post_id=eq.${postId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToPostComments = (postId, callback) => {
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
      async (payload) => {
        // Lấy lại tất cả comments bao gồm cả replies
        const { data: comments, error } = await supabase
          .from("comments")
          .select(
            `
            *,
            profiles:user_id (*)
          `
          )
          .eq("post_id", postId);

        if (!error) {
          // Chuyển đổi dữ liệu phẳng thành cấu trúc cây
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
                if (commentMap[comment.parent_id]) {
                  commentMap[comment.parent_id].replies.push(
                    commentMap[comment.id]
                  );
                }
              } else {
                rootComments.push(commentMap[comment.id]);
              }
            });

            return comments; // Trả về tất cả comments để đếm tổng số
          };

          callback({
            ...payload,
            comments: transformComments(comments),
          });
        }
      }
    )
    .subscribe();
};

// Lấy bài viết theo media type, nếu bài viết có cả ảnh và video thì lấy cả 2
// chỉ không hiện phần media_type không được chọn
// Ví dự như 1 post có 2 ảnh 1 video
// Khi Vô PostScreen thì nó vẫn hiện post đó và chỉ không hiện video thôi, nó cũng tương tự như với VideoScreen

// export const getPostsByMediaType = async (mediaType) => {
//   try {
//     const { data, error } = await supabase
//       .from("posts")
//       .select(
//         `
//       *,
//       profiles:user_id (*),
//       post_media!inner(*),
//       post_likes(*),
//       comments(*)
//     `
//       )
//       .eq("post_media.media_type", mediaType)
//       .order("created_at", { ascending: false });

//     if (error) {
//       alert("Có lỗi xảy ra khi lấy bài viết", error.message);
//       throw error;
//     }
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

export const getPostsByMediaType = async (mediaType) => {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles:user_id (*),
        post_media (*),
        post_likes (*),
        comments (*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      alert("Có lỗi xảy ra khi lấy bài viết", error.message);
      throw error;
    }

    const filteredPosts = posts.filter((post) => {
      const medias = post.post_media || [];
      return (
        medias.length > 0 &&
        medias.every((media) => media.media_type === mediaType)
      );
    });

    return filteredPosts;
  } catch (error) {
    throw error;
  }
};

export const getPostsByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles:user_id (*),
        post_media (*),
        post_likes (*),
        comments (*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      alert("Có lỗi xảy ra khi lấy bài viết", error.message);
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const subscribeToUserPosts = (userId, callback) => {
  return supabase
    .channel(`public:posts:user_id=eq.${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

export const getMediaUrl = (path) => {
  if (!path) return null;
  const { data: { publicUrl } } = supabase.storage.from("post-media").getPublicUrl(path);
  return publicUrl;
};