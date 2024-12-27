// SettingScreen.js
import React, {useContext} from 'react';
import { View, Text, Switch, Button, StyleSheet, StatusBar } from 'react-native';
import { UserContext } from "../../context/UserContext";


const SettingScreen = () => {
    const {  isDarkMode, toggleDarkMode, language, toggleLanguage, logout } = useContext(UserContext);

    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#333' : '#FFF',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    };

    const langText = language === 'en' ? 'Language: English' : 'Ngôn ngữ: Tiếng Việt';

    return (
        <View style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <Text style={[styles.text, { color: isDarkMode ? '#FFF' : '#000' }]}>
                {langText}
            </Text>

            <View style={styles.settingItem}>
                <Text style={[styles.text, { color: isDarkMode ? '#FFF' : '#000' }]}>Dark Mode</Text>
                <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
            </View>

            <View style={styles.settingItem}>
                <Button title="Change Language" onPress={toggleLanguage} />
            </View>
            <View>
            <Button title="Đăng xuất" onPress={logout} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    settingItem: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
});

export default SettingScreen;
