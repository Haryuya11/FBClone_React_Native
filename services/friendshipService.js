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

export const sendFriendRequest = async (friendId) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Không tìm thấy người dùng");

    const { data, error } = await supabase
      .from("friendships")
      .insert([
        {
          user_id: userId,
          friend_id: friendId,
          status: 'pending'
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

export const acceptFriendRequest = async (friendshipId) => {
  try {
    console.log("Accepting friendship with ID:", friendshipId);
    const userId = await getCurrentUserId();

    // Thực hiện cập nhật
    const { data, error } = await supabase
      .from("friendships")
      .update({ 
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', friendshipId)
      .eq('friend_id', userId) // Thêm điều kiện này để match với policy
      .eq('status', 'pending') // Thêm điều kiện này để chỉ update các request đang pending
      .select();

    if (error) {
      console.error("Error updating friendship:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Không thể cập nhật trạng thái kết bạn');
    }

    console.log("Updated friendship data:", data);
    return data[0];
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

export const rejectFriendRequest = async (friendshipId) => {
  try {
    console.log("Rejecting friendship with ID:", friendshipId);
    const userId = await getCurrentUserId();

    // Thực hiện cập nhật
    const { data, error } = await supabase
      .from("friendships")
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', friendshipId)
      .eq('friend_id', userId) // Thêm điều kiện này để match với policy
      .eq('status', 'pending') // Thêm điều kiện này để chỉ update các request đang pending
      .select();

    if (error) {
      console.error("Error updating friendship:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Không thể cập nhật trạng thái kết bạn');
    }

    console.log("Updated friendship data:", data);
    return data[0];
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
};

export const getFriendRequests = async () => {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from("friendships")
      .select(`
        *,
        profiles!friendships_user_id_fkey (*)
      `)
      .eq('friend_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error("Error fetching friend requests:", error);
      throw error;
    }

    console.log("Friend requests data:", data);
    return data;
  } catch (error) {
    console.error("Error in getFriendRequests:", error);
    throw error;
  }
};

export const getFriendshipStatus = async (friendId) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Không tìm thấy người dùng");

    const { data, error } = await supabase
      .from("friendships")
      .select("*")
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

    if (error) throw error;
    if (!data || data.length === 0) return null;
    
    return data[0].status;
  } catch (error) {
    console.error('Error getting friendship status:', error);
    return null;
  }
};
