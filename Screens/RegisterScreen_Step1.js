import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
const RegisterScreen_Step1 = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const firstNameAnimation = useRef(new Animated.Value(0)).current;
  const lastNameAnimation = useRef(new Animated.Value(0)).current;
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);

  const handleFocus = (inputType) => {
    Animated.timing(
      inputType === "firstName" ? firstNameAnimation : lastNameAnimation,
      {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }
    ).start();
  };

  const handleBlur = (inputType) => {
    const value = inputType === "firstName" ? firstName : lastName;
    if (!value) {
      Animated.timing(
        inputType === "firstName" ? firstNameAnimation : lastNameAnimation,
        {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }
      ).start();
    }
  };

  const handleInputGroupPress = (inputRef, inputType) => {
    inputRef.current.focus();
    handleFocus(inputType);
  };

  const floatingLabelStyle = (animation) => ({
    position: "absolute",
    left: 10,
    top: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 5],
    }),
    fontSize: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
  });

  return (
    <LinearGradient
      colors={["#FFE5E5", "#E5F1FF", "#E0F4FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Ionicons name="arrow-back-outline" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Bạn tên gì?</Text>
        <Text style={styles.subtitle}>
          Nhập tên bạn sử dụng trong đời thực.
        </Text>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.inputGroup}
            activeOpacity={1}
            onPress={() => handleInputGroupPress(firstNameRef, "firstName")}
          >
            <Animated.Text
              style={[styles.label, floatingLabelStyle(firstNameAnimation)]}
            >
              Họ
            </Animated.Text>
            <TextInput
              ref={firstNameRef}
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              onFocus={() => handleFocus("firstName")}
              onBlur={() => handleBlur("firstName")}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputGroup}
            activeOpacity={1}
            onPress={() => handleInputGroupPress(lastNameRef, "lastName")}
          >
            <Animated.Text
              style={[styles.label, floatingLabelStyle(lastNameAnimation)]}
            >
              Tên
            </Animated.Text>
            <TextInput
              ref={lastNameRef}
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              onFocus={() => handleFocus("lastName")}
              onBlur={() => handleBlur("lastName")}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register_Step2")}
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
  inputGroup: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    height: 55,
    justifyContent: "center",
    position: "relative",
    flexDirection: "row",
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
});

export default RegisterScreen_Step1;
