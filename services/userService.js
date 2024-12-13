import react from "react";
import { supabase } from "../lib/supabase";

export const signIn = async (email, password) => {
  if (email === "" || password === "") {
    alert("Vui lòng nhập email và mật khẩu");
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    alert(error.message);
  } else {
    console.log("User is signed in");
    global.setIsAuthenticated(true);
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
      alert(authError.message);
      return;
    }

    let avatarUrl = null;

    if (userData.avatar && userData.avatar.uri) {
      const fileExt = userData.avatar.uri.split(".").pop();
      const fileName = `${authData.user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, {
          uri: userData.avatar.uri,
          type: userData.avatar.type,
          name: fileName,
        });

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      avatarUrl = data.publicUrl;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone_number: userData.phoneNumber || null,
        date_of_birth: userData.dateOfBirth
          ? new Date(userData.dateOfBirth).toISOString()
          : null,
        gender: userData.gender || null,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", authData.user.id);

    if (profileError) {
      alert("Có lỗi xảy ra khi lưu thông tin cá nhân", profileError.message);
      return;
    }
    return authData.user;
  } catch (error) {
    console.log(error);
  }
};
