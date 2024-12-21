import { supabase } from "../lib/supabase";

const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

export const addFriend = async (friendId) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Không tìm thấy người dùng");

    const { data, error } = await supabase
      .from("friendships")
      .insert([
        {
          user_id: userId,
          friend_id: friendId,
          status: 'accepted'
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const removeFriend = async (friendId) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Không tìm thấy người dùng");

    const { error } = await supabase
      .from("friendships")
      .delete()
      .or(
        `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
      );

    if (error) throw error;
  } catch (error) {
    console.error("Lỗi khi xóa bạn bè:", error);
    throw error;
  }
};

export const checkFriendship = async (friendId) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Không tìm thấy người dùng");

    const { data, error } = await supabase.rpc("are_friends", {
      user_id: userId,
      friend_id: friendId,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const getFriendsList = async (userId) => {
  try {
    const { data: friendships, error } = await supabase
      .from("friendships")
      .select(
        `
        friend:profiles!friendships_friend_id_fkey (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `
      )
      .eq("user_id", userId)
      .eq("status", "accepted");

    if (error) {
      console.log("Bị lỗi khi lấy danh sách bạn bè", error.message);
      throw error;
    }

    const { data: reverseFriendships, error: reverseError } = await supabase
      .from("friendships")
      .select(
        `
        friend:profiles!friendships_user_id_fkey (
          id,
          first_name,
          last_name,
          avatar_url
        )
      `
      )
      .eq("friend_id", userId)
      .eq("status", "accepted");

    if (reverseError) {
      console.log("Bị lỗi khi lấy danh sách bạn bè", reverseError.message);
      throw reverseError;
    }

    // Kết hợp và lọc trùng
    const allFriends = [
      ...friendships.map((f) => f.friend),
      ...reverseFriendships.map((f) => f.friend),
    ];

    return allFriends;
  } catch (error) {
    throw error;
  }
};

export const getFriendsCount = async (userId) => {
  try {
    const { data, error } = await supabase.rpc("count_friends", {
      user_id: userId,
    });

    if (error) {
      console.log("Bị lỗi khi lấy số lượng bạn bè", error.message);
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const subscribeFriendships = (userId, callback) => {
  return supabase
    .channel(`public:friendships:user_id=eq.${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "friendships",
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};
