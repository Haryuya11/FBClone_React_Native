import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Linking,
} from "react-native";
import { RegisterContext } from "../../context/RegisterContext";

const RegisterScreen_Step4 = ({ navigation }) => {
  const { registerData, setRegisterData } = useContext(RegisterContext);
  const [email, setEmail] = useState(registerData.email || "");
  const emailAnimation = useRef(new Animated.Value(0)).current;
  const emailRef = useRef(null);

  const handleFocus = () => {
    Animated.timing(emailAnimation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!email) {
      Animated.timing(emailAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleInputGroupPress = () => {
    emailRef.current.focus();
    handleFocus();
    setTimeout(() => {
      emailRef.current.setSelection(email.length);
    }, 0);
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

  const handleNext = () => {
    if (email === "" || !email.includes("@") || !email.includes(".")) {
      alert("Email không hợp lệ");
      return;
    }

    setRegisterData((prev) => ({
      ...prev,
      email: email,
    }));
    navigation.navigate("Register_Step5");
  };

  useEffect(() => {
    // emailRef.current.focus();
    handleFocus();
  }, []);

  return (
    <LinearGradient
      colors={["#FFE5E5", "#E5F1FF", "#E0F4FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Register_Step3")}>
          <Ionicons name="arrow-back-outline" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Email của bạn là gì?</Text>
        <Text style={styles.subtitle}>
          Nhập email có thể dùng để liên hệ với bạn. Thông tin này sẽ không hiển
          thị với ai khác trên trang cá nhân của bạn.
        </Text>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.inputGroup}
            activeOpacity={1}
            onPress={() => handleInputGroupPress(emailRef, "email")}
          >
            <Animated.Text
              style={[styles.label, floatingLabelStyle(emailAnimation)]}
            >
              Email
            </Animated.Text>
            <TextInput
              ref={emailRef}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Bạn cũng có thể nhận đươc email của chúng tôi và có thể chọn không
          nhận bất cứ lúc nào.
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL("https://www.facebook.com/help/297947214257999")
            }
          >
            Tìm hiểu thêm.
          </Text>
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
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
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
  },

  link: {
    fontSize: 16,
    color: "#007AFF",
    textAlign: "center",
  },
});

export default RegisterScreen_Step4;
