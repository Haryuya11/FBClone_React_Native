// SettingScreen.js
import React, { useContext } from 'react';
import { View, Text, Switch, Button, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { UserContext } from "../../context/UserContext";


const SettingScreen = () => {
    const { isDarkMode, language, toggleDarkMode, toggleLanguage, logout } = useContext(UserContext);

    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#333' : '#FFF',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    };

    return (
        <View style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={isDarkMode ? 'black' : '#FFF'}
            />

            <Text style={[styles.text, { color: isDarkMode ? '#FFF' : '#000' }]}>
                {language === 'en' ? 'Language: English' : 'Ngôn ngữ: Tiếng Việt'}
            </Text>

            <View style={styles.settingItem}>
                <Text style={[styles.text, { color: isDarkMode ? '#FFF' : '#000' }]}>
                    {language === 'vn' ? 'Chế độ tối' : 'Dark mode'}
                </Text>
                <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
            </View>

            <View style={styles.settingItem}>
                <TouchableOpacity onPress={toggleLanguage}>
                    <Text style={[styles.text, { color: isDarkMode ? '#FFF' : '#000' }]}>
                        {language === 'vn' ? 'Thay đổi ngôn ngữ' : 'Change language'}
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
            <TouchableOpacity onPress={logout}>
                    <Text style={[styles.text, { color: isDarkMode ? '#FFF' : '#000' }]}>
                        {language === 'vn' ? 'Đăng xuất' : 'Log out'}
                    </Text>
                </TouchableOpacity>
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
