import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';


const PostArticlesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>PostArticlesScreen</Text>
    </View>
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
    marginBottom: 10,
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  friendList: {
    justifyContent: 'space-between',
  },
  friendItem: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  friendName: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PostArticlesScreen;
