import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RegisterContext } from "../../context/RegisterContext";

const BirthdayInfoPopup = ({ visible, onClose }) => {
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

          <Text style={styles.modalTitle}>Ngày sinh</Text>
          <Text style={styles.modalText}>
            Cung cấp ngày sinh của bạn sẽ giúp cải thiện các tính năng và quảng
            cáo bạn thấy, đồng thời giúp giữ an toàn cho cộng đồng Facebook. Bạn
            có thể tìm thấy ngày sinh của mình trong cài đặt tài khoản thông tin
            cá nhân.{" "}
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL("https://www.facebook.com/privacy/policy")
              }
            >
              Tìm hiểu thêm về cách chúng tôi sử dụng thông tin của bạn trong
              Chính sách quyền riêng tư
            </Text>
          </Text>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const RegisterScreen_Step2 = ({ navigation }) => {
  const { registerData, setRegisterData } = useContext(RegisterContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(
    registerData.dateOfBirth ? new Date(registerData.dateOfBirth) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [age, setAge] = useState(null);

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    const day = String(date.getDate());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} tháng ${month}, ${year}`;
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setAge(calculateAge(selectedDate));
    }
  };

  const handleNext = () => {
    if(age < 13) {
      alert("Bạn phải đủ 13 tuổi trở lên để sử dụng dịch vụ của chúng tôi");
      return;
    }

    setRegisterData((prev) => ({
      ...prev,
      dateOfBirth: date.toISOString(),
    }));
    navigation.navigate("Register_Step3");
  }

  useEffect(() => {
    setAge(calculateAge(date));
  }, []);

  return (
    <LinearGradient
      colors={["#FFE5E5", "#E5F1FF", "#E0F4FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Register_Step1")}>
          <Ionicons name="arrow-back-outline" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Ngày sinh của bạn là khi nào?</Text>
        <Text style={styles.subtitle}>
          Chọn ngày sinh của bạn. Bạn luôn có thể thay đặt thông tin này ở chế
          độ riêng tư vào lúc khác.{" "}
          <Text style={styles.link} onPress={() => setModalVisible(true)}>
            Tại sao tôi cần cung cấp ngày sinh của mình?
          </Text>
        </Text>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateLabel}>
              Ngày sinh ({age ? age : "0"} tuổi)
            </Text>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Tiếp</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Tôi có tài khoản rồi</Text>
        </TouchableOpacity>
      </View>

      <BirthdayInfoPopup
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    height: 50,
    width: "100%",
    justifyContent: "center",
  },
  dateLabel: {
    fontSize: 12,
    color: "#666",
  },
  dateText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
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
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});

export default RegisterScreen_Step2;
