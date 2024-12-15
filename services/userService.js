import react from "react";
import { supabase } from "../lib/supabase";

export const loadUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      alert("Có lỗi xảy ra khi tải thông tin cá nhân", error.message);
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
    if (authError) {
      alert("Có lỗi xảy ra khi đăng nhập", authError.message);
      throw authError;
    }

    const profileData = await loadUserProfile(authData.user.id);

    return {
      user: authData.user,
      profile: profileData,
    };
  } catch (error) {
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
      },
    });

    if (authError) {
      alert("Có lỗi xảy ra khi đăng ký" + authError.message);
      throw authError;
    }

    let avatarUrl = null;
    if (userData.avatar && userData.avatar.uri) {
      const fileExt = userData.avatar.uri.split(".").pop();
      const fileName = `${authData.user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, {
          uri: userData.avatar.uri,
          type: "image/" + fileExt,
          name: fileName,
        });

      if (uploadError) {
        alert("Có lỗi xảy ra khi tải ảnh đại diện", uploadError.message);
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      avatarUrl = data.publicUrl;
    }

    const updateProfileData = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone_number: userData.phoneNumber || null,
      date_of_birth: userData.dateOfBirth
        ? new Date(userData.dateOfBirth).toISOString()
        : null,
      gender: userData.gender || null,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update(updateProfileData)
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      alert("Có lỗi xảy ra khi tạo thông tin cá nhân", profileError.message);
      throw profileError;
    }

    return {
      user: authData.user,
      profile: profileData,
    };
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (userId, updateData) => {
  try {
    let avatarUrl = updateData.avatar_url;
    if (updateData.avatar && updateData.avatar.uri) {
      const fileExt = updateData.avatar.uri.split(".").pop();
      const fileName = `${userId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(
          fileName,
          {
            uri: updateData.avatar.uri,
            type: "image/" + fileExt,
            name: fileName,
          },
          {
            upsert: true,
          }
        );

      if (uploadError) {
        alert("Có lỗi xảy ra khi tải ảnh đại diện", uploadError.message);
        throw uploadError;
      }

      const { data: fileData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      avatarUrl = fileData.publicUrl;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...updateData,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .single();

    if (error) {
      alert("Có lỗi xảy ra khi cập nhật thông tin cá nhân", error.message);
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Có lỗi xảy ra khi đăng xuất", error.message);
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
