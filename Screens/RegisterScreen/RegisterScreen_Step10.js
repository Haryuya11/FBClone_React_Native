import React, { useEffect, useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RegisterContext } from "../../context/RegisterContext";
import { UserContext } from "../../context/UserContext";

const RegisterScreen_Step10 = ({ navigation, route }) => {
  const { registerData } = useContext(RegisterContext);
  const { register } = useContext(UserContext);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await register(registerData);
      } catch (error) {
        alert(error.message);
        navigation.navigate("Register_Step1");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Facenote</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.avatar} source={registerData.avatar} />
        </View>
        <Text style={styles.title}>
          {registerData.lastName}, Chào mừng bạn đến với Facenote
        </Text>
        <Text style={styles.subtitle}>
          Hãy bắt đầu tùy chỉnh trải nghiệm của bạn nhé
        </Text>
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
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "blue",
  },
  contentContainer: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    marginBottom: 15,
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 30,
    textAlign: "center",
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
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});

export default RegisterScreen_Step10;
