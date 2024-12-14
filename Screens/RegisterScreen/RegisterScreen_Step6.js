import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState, useEffect, useContext } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RegisterContext } from "../../context/RegisterContext";

const generateVerificationCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const RegisterScreen_Step6 = ({ navigation }) => {
  const { registerData, setRegisterData } = useContext(RegisterContext);
  const [code, setCode] = useState("");
  const [generateCode, setGenerateCode] = useState("");
  const [expiryTime, setExpiryTime] = useState(null);
  const codeAnimation = useRef(new Animated.Value(0)).current;
  const codeRef = useRef(null);

  useEffect(() => {
    sendVerificationCode();
  }, []);

  const sendVerificationCode = async () => {
    const newCode = generateVerificationCode();
    console.log(newCode);
    setGenerateCode(newCode);
    setExpiryTime(Date.now() + 5 * 60 * 1000);
    const email = registerData.email.trim();
    const apiKey =
      "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";

    const mailOptions = {
      personalizations: [
        {
          to: [{ email }],
          subject: "Mã xác nhận tài khoản",
        },
      ],
      from: { email: "vchieu1108@gmail.com" },
      content: [
        {
          type: "text/plain",
          value: `Mã xác nhận của bạn là: ${newCode}`,
        },
      ],
    };

    try {
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(mailOptions),
          });
          
          if (!response.ok) {
            throw new Error(`SendGrid error: ${response.status}`);
          }
          
    } catch (error) {
      console.error("Chi tiết lỗi:", error);
      alert("Có lỗi xảy ra khi gửi mã xác nhận. Vui lòng thử lại sau.");
    }
  };

  const handleNext = () => {
    if (code === generateCode && Date.now() < expiryTime) {
      navigation.navigate("Register_Step7");
    } else {
      alert("Mã xác nhận không hợp lệ. Vui lòng thử lại.");
    }
  };

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
      colors={["#FFE5E5", "#E5F1FF", "#E0F4FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Register_Step5")}>
          <Ionicons name="close-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Nhập mã xác nhận</Text>
        <Text style={styles.subtitle}>
          Để xác nhận tài khoản, hãy nhập mã gồm 5 chữ số mà chúng tôi đã gửi
          đến email {registerData.email} của bạn.
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
          onPress={handleNext}
        >
          <Text style={[styles.buttonText, styles.buttonNextText]}>Tiếp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonReset]}
          onPress={sendVerificationCode}
        >
          <Text style={[styles.buttonText, styles.buttonResetText]}>
            Tôi không nhận được mã
          </Text>
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
    color: "#000",
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
    color: "#000",
  },
  input: {
    fontSize: 14,
    paddingVertical: 8,
    marginTop: 10,
    color: "#000",
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
  buttonReset: {
    backgroundColor: "transparent",
    borderWidth: 1,
    marginTop: 15,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
  },
  buttonNextText: {
    color: "#fff",
  },
  buttonResetText: {
    color: "#000",
  },
});

export default RegisterScreen_Step6;
