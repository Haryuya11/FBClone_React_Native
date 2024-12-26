import React, {memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';


const HeaderNavigationComponent = ({ navigationButtons, onButtonPress, selectedButton }) => {
  const handlePress = useCallback(
    (name) => {
      onButtonPress(name);
    },
    [onButtonPress]
  );

  return (
    <View style={styles.headerBottom}>
      {navigationButtons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={styles.headerButton}
          onPress={() => handlePress(button.name)}
        >
          <View style={styles.buttonLabelContainer}>
            <Text style={styles.headerButtonText}>
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
    bottom: 0,
    position: 'relative',

  },
  underlineContainer: {
    position: 'absolute',
    bottom: -8,
    left: -23,
    alignItems: 'center',
  },
  selectedButton: {
    fontSize: 16,
    color: '#316ff6',
    fontWeight: 'bold',
    marginTop: 5,
    top: 0,
    width: 80,
    textAlign: 'center',
  },
});

export default memo(HeaderNavigationComponent);
