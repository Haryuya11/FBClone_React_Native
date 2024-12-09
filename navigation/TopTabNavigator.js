import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../Screens/Mainscreen/HomeScreen';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Facenote</Text>
        <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
          <Text style={styles.iconText}>🔍</Text>
        </TouchableOpacity>

        {/* Nút Chat */}
        <TouchableOpacity style={styles.chatButton} onPress={() => {}}>
          <Text style={styles.iconText}>💬</Text>
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          labelStyle: { fontSize: 12 },
          tabStyle: { width: 'auto' },
          style: { backgroundColor: '#6200EE' },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Post" component={HomeScreen} />
        <Tab.Screen name="Video" component={HomeScreen} />
        <Tab.Screen name="Profile" component={HomeScreen} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  headerContainer: {
    paddingTop: 20, 
    backgroundColor: 'white',
    paddingBottom: 10,
    alignItems: 'center',
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 14, 
  },
  headerText: {
    fontSize: 30,
    color: 'blue',
    fontWeight: 'bold',
  },
  searchButton: {
    marginLeft: 140,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
  },
  chatButton: {
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
  },
  iconText: {
    fontSize: 20,
    color: 'white',
  },
});

export default TopTabNavigator;
