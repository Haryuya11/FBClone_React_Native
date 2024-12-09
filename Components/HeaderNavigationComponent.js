import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HeaderNavigationComponent = ({ navigationButtons, onButtonPress, selectedButton }) => {
  return (
    <View style={styles.headerBottom}>
      {navigationButtons.map((button, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.headerButton}
          onPress={() => onButtonPress(button.name)}
        >
          <View style={styles.buttonLabelContainer}>
            <Text 
              style={[
                styles.headerButtonText, 
                button.name === selectedButton && styles.selectedButtonText
              ]}
            >
              {button.label}
            </Text>
          </View>
          {button.name === selectedButton && (
            <View style={styles.underlineContainer}>
              <Text style={styles.selectedButton}>________</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    
  },
  headerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    position: 'relative', 
  },
  buttonLabelContainer: {
    position: 'relative', 
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', 
    
  },
  selectedButtonText: {
    color: 'blue',
    textDecorationLine: 'underline', 
    
  },
  underlineContainer: {
    position: 'absolute', 
    bottom: 0, 
    left: 0,
    alignItems: 'center', 
  },
  selectedButton: {
    fontSize: 16,
    color: 'blue', 
    fontWeight: 'bold',
    marginTop: 5, 
    top: 0,
    width: 63, 
    textAlign: 'center', 
  },
});

export default HeaderNavigationComponent;
