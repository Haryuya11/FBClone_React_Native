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

const VerifyScreen = ({ navigation }) => {
  const [code, setCode] = useState("");
  const codeAnimation = useRef(new Animated.Value(0)).current;
  const codeRef = useRef(null);

  const handleFocus = () => {
    Animated.timing(codeAnimation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!code) {
      Animated.timing(codeAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleInputGroupPress = () => {
    codeRef.current.focus();
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

  return (
    <LinearGradient
      colors={["#002238", "#003A59", "#004F73"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Register_Step6")}>
          <Ionicons name="close-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Nhập mã xác nhận</Text>
        <Text style={styles.subtitle}>
          Để xác nhận tài khoản, hãy nhập mã gồm 5 chữ số mà chúng tôi đã gửi
          đến email của bạn hoặc số điện thoại của bạn.
        </Text>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.inputGroup}
            activeOpacity={1}
            onPress={() => handleInputGroupPress(codeRef, "code")}
          >
            <Animated.Text
              style={[styles.label, floatingLabelStyle(codeAnimation)]}
            >
              Mã xác nhận
            </Animated.Text>
            <TextInput
              ref={codeRef}
              style={styles.input}
              value={code}
              onChangeText={setCode}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.buttonNext]}
          onPress={() => navigation.navigate("Register_Step6")}
        >
          <Text style={styles.buttonText}>Tiếp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonChange]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Tôi không nhận được mã</Text>
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
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
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
    paddingHorizontal: 10,
    height: 55,
    justifyContent: "center",
    position: "relative",
  },
  label: {
    fontSize: 14,
    paddingHorizontal: 4,
    color: "#fff",
  },
  input: {
    fontSize: 14,
    paddingVertical: 8,
    marginTop: 10,
    color: "#fff",
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
  },
  buttonNext: {
    backgroundColor: "blue",
  },
  buttonChange: {
    backgroundColor: "transparent",
    borderWidth: 1,
    marginTop: 15,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
  }
});

export default VerifyScreen;
