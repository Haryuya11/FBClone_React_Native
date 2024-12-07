import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Label,
} from "react-native";
import { RadioButton } from "react-native-paper";

const GenderInfoPopup = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={["#FFE5E5", "#E5F1FF", "#E0F4FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.modalView}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalTitle}>Chọn danh xưng</Text>
          <Text style={styles.modalText}>
            Danh xưng của bạn hiển thị với tất cả mọi người.
          </Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButtonItem}
              onPress={() => {
                onClose();
              }}
            >
              <Text style={styles.modalButtonText}>Cô ấy</Text>
              <Text style={styles.modalButtonSubText}>
                "Chúc cô ấy sinh nhật vui vẻ!"
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonItem}
              onPress={() => {
                onClose();
              }}
            >
              <Text style={styles.modalButtonText}>Anh ấy</Text>
              <Text style={styles.modalButtonSubText}>
                "Chúc anh ấy sinh nhật vui vẻ!"
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonItem}
              onPress={() => {
                onClose();
              }}
            >
              <Text style={styles.modalButtonText}>Họ</Text>
              <Text style={styles.modalButtonSubText}>
                "Chúc họ sinh nhật vui vẻ!"
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const GenderInfoOther = ({ visible, setGenderInfoPopupVisible }) => {
  return (
    <View
      style={[
        visible ? { display: "flex" } : { display: "none" },
        styles.otherContainer,
      ]}
    >
      <TouchableOpacity
        style={styles.otherContentItem}
        onPress={() => setGenderInfoPopupVisible(true)}
      >
        <View style={styles.otherTextContainer}>
          <Text style={styles.otherTextTitle}>Cô ấy</Text>
          <Text style={styles.otherTextSubtitle}>Danh xưng của bạn</Text>
        </View>
        <Ionicons
          name="chevron-down-outline"
          size={16}
          color="#666"
          style={styles.otherIcon}
        />
      </TouchableOpacity>
      <View style={styles.otherLine}></View>

      <View style={styles.otherContentItem2}>
        <Text style={styles.otherTextSubtitle}>Giới tính(Không bắt buộc)</Text>
        <TextInput placeholder="" style={styles.otherTextInput} />
      </View>
    </View>
  );
};

const RegisterScreen_Step3 = ({ navigation }) => {
  const [gender, setGender] = useState(null);
  const [genderInfoPopupVisible, setGenderInfoPopupVisible] = useState(false);
  return (
    <LinearGradient
      colors={["#FFE5E5", "#E5F1FF", "#E0F4FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Giới tính của bạn là gì?</Text>
        <Text style={styles.subtitle}>
          Bạn có thể thay đổi người nhìn thấy giới tính của bạn trên trang cá
          nhân vào lúc khác.
        </Text>
        <View style={styles.radioButtonContainer}>
          <View style={styles.radioButtonItem}>
            <View style={styles.radioTextContainer}>
              <Text style={styles.radioButtonText}>Nam</Text>
            </View>
            <RadioButton
              value="Nam"
              status={gender === "Nam" ? "checked" : "unchecked"}
              onPress={() => setGender("Nam")}
              style={styles.radioButton}
            />
          </View>
          <View style={styles.radioButtonItem}>
            <View style={styles.radioTextContainer}>
              <Text style={styles.radioButtonText}>Nữ</Text>
            </View>
            <RadioButton
              value="Nu"
              status={gender === "Nu" ? "checked" : "unchecked"}
              onPress={() => setGender("Nu")}
            />
          </View>
          <View style={styles.radioButtonItem}>
            <View style={styles.radioTextContainer}>
              <Text style={styles.radioButtonText}>Lựa chọn khác</Text>
              <Text style={styles.radioButtonSubText}>
                Chọn Tùy chọn khác nếu bạn thuộc giới tính khác hoặc không muốn
                tiết lộ
              </Text>
            </View>
            <RadioButton
              value="Other"
              status={gender === "Other" ? "checked" : "unchecked"}
              onPress={() => {
                setGender("Other");
                setGenderInfoPopupVisible(true);
              }}
            />
          </View>
        </View>

        <GenderInfoOther
          visible={gender === "Other"}
          setGenderInfoPopupVisible={setGenderInfoPopupVisible}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Tiếp</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Tôi có tài khoản rồi</Text>
        </TouchableOpacity>
      </View>
      <GenderInfoPopup
        visible={genderInfoPopupVisible}
        onClose={() => setGenderInfoPopupVisible(false)}
      />
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
  radioButtonContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  radioButtonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  radioTextContainer: {
    flex: 1,
  },
  radioButtonText: {
    fontSize: 16,
  },
  radioButtonSubText: {
    fontSize: 12,
    color: "#666",
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
    textAlign: "center",
    color: "#007AFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 15,
  },
  modalButtonContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  modalButtonItem: {
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  modalButtonText: {
    fontSize: 16,
  },
  modalButtonSubText: {
    fontSize: 12,
    color: "#666",
  },
  otherContainer: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  otherContentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  otherTextContainer: {
    flex: 1,
    flexDirection: "column",
  },
  otherTextTitle: {
    fontSize: 16,
  },
  otherTextSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  otherLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  otherContentItem2: {
    flexDirection: "column",
    paddingHorizontal: 10,
  },
  otherTextInput: {
    marginTop: 0,
    padding: 0,
  },
});

export default RegisterScreen_Step3;
