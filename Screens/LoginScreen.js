import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LoginScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={["#FFE5E5", "#E5F1FF", "#E0F4FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/logo/logo_react_native.png")}
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            style={styles.input}
          />
          <TextInput
            placeholder="Mật khẩu"
            placeholderTextColor="#666"
            secureTextEntry={true}
            style={styles.input}
          />
        </View>

        <View style={[styles.loginButton, styles.button]}>
          <TouchableOpacity>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.forgotPasswordText}>Bạn quên mật khẩu ư?</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={[styles.registerButton, styles.button]}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register_Step1")}
          >
            <Text style={styles.registerButtonText}>Tạo tài khoản mới</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dùng để debug */}
      <TouchableOpacity
        onPress={() => {setIsAuthenticated(true);}}
      >
        
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 80,
    marginTop: 250,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 12,
    padding: 10,
    height: 50,
    width: "100%",
  },
  button: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    borderRadius: 50,
  },
  loginButton: {
    backgroundColor: "blue",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  forgotPasswordText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },

  bottomContainer: {
    width: "100%",
    paddingBottom: 60,
  },
  registerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "blue",
  },
  registerButtonText: {
    color: "blue",
    textAlign: "center",
    fontSize: 18,
  },
});
