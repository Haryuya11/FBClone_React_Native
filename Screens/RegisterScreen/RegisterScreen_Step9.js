import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
  Image,
} from "react-native";
import { RegisterContext } from "../../context/RegisterContext";
import { UserContext } from "../../context/UserContext";

const RegisterScreen_Step9 = ({ navigation }) => {
  const { registerData } = useContext(RegisterContext);
  const { register } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRegister = () => {
    setIsLoading(true);
    try {
      register(registerData);
    } catch (error) {
      alert("Đăng ký thất bại: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={["#FFE5E5", "#E5F1FF", "#E0F4FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Register_Step8")}>
          <Ionicons name="arrow-back-outline" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../assets/logo/register_step6_image.jpg")}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.title}>
          Để đăng ký, hãy đọc cũng như đồng ý với các điều khoản và chính sách
          của chúng tôi
        </Text>
        <Text style={styles.subtitle}>Các điểm chính bạn nên biết</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="id-card-outline" size={24} style={styles.icon} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>
                Chúng tôi dùng thông tin của bạn để hiển thị cũng như cá nhân
                hóa quảng cáo và nội dung thương mại mà bạn có thể sẽ thích.
                Chúng tôi cũng dùng thông tin đó để nghiên cứu và đổi mới, bao
                gồm cả để phục vụ hoạt động vì cộng đồng cũng như lợi ích công.
                <Text
                  onPress={() =>
                    Linking.openURL("https://www.facebook.com/privacy/policy")
                  }
                  style={styles.link}
                >
                  Tìm hiểu thêm
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="shield-outline" size={24} style={styles.icon} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>
                Bạn có thể chọn cung cấp thông tin về bản thân mà thông tin này
                có thể được bảo vệ đặc biệt theo luật quyền riêng tư ở nơi bạn
                sống.
                <Text
                  onPress={() =>
                    Linking.openURL("https://www.facebook.com/privacy/policy")
                  }
                  style={styles.link}
                >
                  Tìm hiểu thêm
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="settings-outline" size={24} style={styles.icon} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>
                Bạn có thể truy cập, thay đổi hoặc xóa thông tin của mình bất cứ
                lúc nào.
                <Text
                  onPress={() =>
                    Linking.openURL("https://www.facebook.com/privacy/policy")
                  }
                  style={styles.link}
                >
                  Tìm hiểu thêm
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={24} style={styles.icon} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>
                Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin
                liên hệ của bạn lên Facebook.
                <Text
                  onPress={() =>
                    Linking.openURL("https://www.facebook.com/privacy/policy")
                  }
                  style={styles.link}
                >
                  Tìm hiểu thêm
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={24} style={styles.icon} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>
                Bạn cũng sẽ nhận được email của chúng tôi và có thể chọn ngừng
                nhận bất cứ lúc nào.
                <Text
                  onPress={() =>
                    Linking.openURL("https://www.facebook.com/privacy/policy")
                  }
                  style={styles.link}
                >
                  Tìm hiểu thêm
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Bằng việc đăng ký, bạn đồng ý với{" "}
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL("https://www.facebook.com/legal/terms")
              }
            >
              Điều khoản
            </Text>
            ,{" "}
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL("https://www.facebook.com/privacy/policy")
              }
            >
              Chính sách quyền riêng tư
            </Text>{" "}
            và{" "}
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL("https://www.facebook.com/policies/cookies")
              }
            >
              Chính sách cookie
            </Text>{" "}
            của Facebook.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Tôi đồng ý</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Bạn đã có tài khoản u?</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  infoSection: {
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    color: "#666",
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  button: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "blue",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  link: {
    color: "blue",
    textAlign: "center",
  },
  bottomContainer: {
    width: "100%",
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
});
export default RegisterScreen_Step9;
