import React, { useRef, useState, useContext, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import phoneCodes from "../../assets/data/phoneCode.json";
import { Picker } from "@react-native-picker/picker";
import { RegisterContext } from "../../context/RegisterContext";
const RegisterScreen_Step7 = ({ navigation }) => {
  const { registerData, setRegisterData } = useContext(RegisterContext);
  const [code, setCode] = useState("+84");
  const [phoneNumber, setPhoneNumber] = useState(
    registerData.phoneNumber || ""
  );
  const codeAnimation = useRef(new Animated.Value(0)).current;
  const phoneAnimation = useRef(new Animated.Value(0)).current;
  const phoneRef = useRef(null);

  useEffect(() => {
    if (phoneNumber) {
      handleFocus("phone");
    }
  }, []);

  const handleFocus = (inputType) => {
    Animated.timing(inputType === "code" ? codeAnimation : phoneAnimation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (inputType) => {
    const value = inputType === "code" ? code : phoneNumber;
    if (!value) {
      Animated.timing(inputType === "code" ? codeAnimation : phoneAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
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

  const handleCodeChange = (itemValue) => {
    setCode(itemValue);
  };

  const handleNext = (isSkip) => {
    if (isSkip) {
      setRegisterData({ ...registerData, phoneNumber: "" });
    } else {
      const vietnamPhoneNumberPattern = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
      if (!vietnamPhoneNumberPattern.test(phoneNumber)) {
        alert("Số điện thoại không hợp lệ");
        return;
      }
      const formattedPhoneNumber = phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber;
      setRegisterData((prev) => ({
        ...prev,
        phoneNumber: formattedPhoneNumber,
      }));
    }
    navigation.navigate("Register_Step8");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Thêm số di động vào tài khoản của bạn</Text>
        <Text style={styles.subtitle}>
          Chúng tôi sử dụng số điện thoại của bạn để hỗ trợ bạn đăng nhập và gửi
          thông báo qua SMS.
        </Text>

        <View style={styles.inputContainer}>
          <View style={[styles.inputGroup, styles.area_code]}>
            <Text style={styles.label}>Mã vùng</Text>
            <Text style={styles.codeText}>{code}</Text>
            <Picker
              selectedValue={code}
              style={[styles.codePicker]}
              onValueChange={handleCodeChange}
              mode={"dropdown"}
            >
              {phoneCodes.countries.map((country) => (
                <Picker.Item
                  key={country.code}
                  label={`${country.name} (${country.code})`}
                  value={country.code}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={[styles.inputGroup, styles.phone_number]}
            activeOpacity={1}
            onPress={() => handleInputGroupPress(phoneRef, "phone")}
          >
            <Animated.Text
              style={[styles.label, floatingLabelStyle(phoneAnimation)]}
            >
              Số điện thoại
            </Animated.Text>
            <TextInput
              ref={phoneRef}
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onFocus={() => handleFocus(phoneAnimation)}
              onBlur={() => handleBlur(phoneAnimation, phoneNumber)}
              keyboardType="phone-pad"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonNext]}
          onPress={() => {
            handleNext(false);
          }}
        >
          <Text style={[styles.buttonText, styles.buttonNextText]}>
            Thêm số
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonPass]}
          onPress={() => {
            handleNext(true);
          }}
        >
          <Text style={[styles.buttonText, styles.buttonPassText]}>Bỏ qua</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 55,
    justifyContent: "center",
    position: "relative",
  },

  area_code: {
    width: "25%",
  },

  phone_number: {
    width: "70%",
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
  buttonPass: {
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
  buttonPassText: {
    color: "#000",
  },
  picker: {
    height: 40,
    width: "100%",
    marginTop: 5,
  },
  codeText: {
    fontSize: 16,
    color: "#000",
  },
  codePicker: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
});

export default RegisterScreen_Step7;
