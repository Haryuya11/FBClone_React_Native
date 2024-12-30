import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { RegisterContext } from "../../context/RegisterContext";
const RegisterScreen_Step8 = ({ navigation }) => {
  const { registerData, setRegisterData } = React.useContext(RegisterContext);
  const [avatar, setAvatar] = useState(
    registerData.avatar || require("../../assets/avatar/avatar_default.png")
  );

  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar({ uri: result.assets[0].uri });
    }
  };

  const handleNext = (isSkip) => {
    if (isSkip) {
      setRegisterData({
        ...registerData,
        avatar: require("../../assets/avatar/avatar_default.png"),
      });
    } else {
      setRegisterData({ ...registerData, avatar });
    }
    navigation.navigate("Register_Step9");
  };

  return (
    <LinearGradient
      colors={["#FFE5E5", "#E5F1FF", "#E0F4FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Thêm ảnh đại diện</Text>
        <Text style={styles.subtitle}>
          Hãy thêm ảnh đại diện để bạn bè dễ dàng nhận ra bạn. Mọi người có thể
          nhìn thấy ảnh của bạn.
        </Text>

        <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
          <Image style={styles.avatar} source={avatar} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSave]}
          onPress={() => handleNext(false)}
        >
          <Text style={[styles.buttonText, styles.buttonSaveText]}>
            Thêm ảnh
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonPass]}
          onPress={() => handleNext(true)}
        >
          <Text style={[styles.buttonText, styles.buttonPassText]}>Bỏ qua</Text>
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
  bottomContainer: {
    width: "100%",
    paddingBottom: 40,
  },
  imageContainer: {
    width: 210,
    alignItems: "center",
    marginBottom: 80,
    marginTop: 50,
    backgroundColor: "#fff",
    borderRadius: 100,
    alignSelf: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  button: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    borderRadius: 50,
  },
  buttonSave: {
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
  buttonSaveText: {
    color: "#fff",
  },
  buttonPassText: {
    color: "#000",
  },
  link: {
    fontSize: 16,
    textAlign: "center",
    color: "#007AFF",
  },
});

export default RegisterScreen_Step8;
