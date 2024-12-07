import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Linking,
} from "react-native";

const RegisterScreen_Step5 = ({ navigation, route }) => {
  const { from } = route.params || { from: "email" };

  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordAnimation = useRef(new Animated.Value(0)).current;
  const passwordRef = useRef(null);

  const handleBack = () => {
    if (from === "email") {
      navigation.navigate("Register_Step4_Email");
    } else {
      navigation.navigate("Register_Step4_Phone");
    }
  };

  const handleFocus = () => {
    Animated.timing(passwordAnimation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!password) {
      Animated.timing(passwordAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleInputGroupPress = () => {
    passwordRef.current.focus();
    handleFocus();
  };

  const floatingLabelStyle = (animation) => ({
    position: "absolute",
    left: 10,
    top: animation.interpolate({ inputRange: [0, 1], outputRange: [15, 5] }),
    fontSize: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 12],
    }),
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <LinearGradient
      colors={["#FFE5E5", "#E5F1FF", "#E0F4FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back-outline" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Tạo mật khẩu</Text>
        <Text style={styles.subtitle}>
          Tạo mật khẩu gồm ít nhất 6 chữ cái hoặc chữ số. Bạn nên chọn mật khẩu
          thật khó đoán.
        </Text>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.inputGroup}
            activeOpacity={1}
            onPress={() => handleInputGroupPress(passwordRef, "password")}
          >
            <Animated.Text
              style={[styles.label, floatingLabelStyle(passwordAnimation)]}
            >
              Mật khẩu
            </Animated.Text>
            <View style={styles.passwordContainer}>
              <TextInput
                ref={passwordRef}
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                onFocus={handleFocus}
                onBlur={handleBlur}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={togglePasswordVisibility}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register_Step6")}
        >
          <Text style={styles.buttonText}>Tiếp</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Tôi có tài khoản rồi</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  eyeIcon: {
    padding: 10,
    position: "absolute",
    right: 0,
  },
  inputGroup: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    height: 55,
    justifyContent: "center",
    position: "relative",
  },
  label: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 4,
  },
  input: {
    fontSize: 14,
    paddingVertical: 8,
    marginTop: 10,
    paddingRight: 40,
  },
  bottomContainer: {
    width: "100%",
    paddingBottom: 40,
  },
  button: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "blue",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  link: {
    fontSize: 16,
    color: "#007AFF",
    textAlign: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});

export default RegisterScreen_Step5;
