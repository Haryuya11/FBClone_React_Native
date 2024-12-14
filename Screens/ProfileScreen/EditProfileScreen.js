import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('Nguyễn Văn A');
  const [email, setEmail] = useState('example@gmail.com');
  const [phone, setPhone] = useState('0123456789');
  const [coverPhoto, setCoverPhoto] = useState('https://img.freepik.com/photos-premium/planete-montagnes-planetes-arriere-plan_746764-103.jpg');
  const [avatar, setAvatar] = useState('https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg');

  const handleSave = () => {
    Alert.alert('Thông báo', 'Thông tin đã được cập nhật!');
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack(); 
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa trang cá nhân</Text>
      </View>

      {/* Cover Photo */}
      <View style={styles.coverPhotoContainer}>
        <Image source={{ uri: coverPhoto }} style={styles.coverPhoto} />
        <TouchableOpacity
          style={styles.editCoverButton}
          onPress={() => Alert.alert('Chức năng thay đổi ảnh bìa sẽ được thêm sau!')}
        >
          <Text style={styles.editButtonText}>Thay đổi ảnh bìa</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <TouchableOpacity
          style={styles.editAvatarButton}
          onPress={() => Alert.alert('Chức năng thay đổi ảnh đại diện sẽ được thêm sau!')}
        >
          <Text style={styles.editButtonText}>Thay đổi ảnh đại diện</Text>
        </TouchableOpacity>
      </View>

      {/* Form chỉnh sửa thông tin */}
      <View style={styles.form}>
        <Text style={styles.label}>Tên</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={(text) => setPhone(text)}
          keyboardType="phone-pad"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  coverPhotoContainer: {
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  editCoverButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -80,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 200,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editAvatarButton: {
    marginTop: 10,
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 5,
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1877F2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F02849',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
