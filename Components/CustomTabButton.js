import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CustomTabButton = ({ children, onPress, accessibilityState, iconName, label, inactiveColor }) => {
  const focused = accessibilityState.selected;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonContainer, focused ? styles.focusedButton : styles.unfocusedButton]}
      activeOpacity={0.7}
    >
      <View style={focused ? styles.focusedIconWrapper : styles.unfocusedIconWrapper}>
        <Icon
          name={iconName}
          size={focused ? 24 : 22} // Adjust size as needed
          color={focused ? '#FFFFFF' : inactiveColor} // White for focused, inactiveColor for unfocused
        />
      </View>
      {focused && <Text style={styles.focusedLabel}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center content horizontally
    paddingHorizontal: 15,
    marginHorizontal: 5, // Small margin between buttons
    height: 45, // Height for the button itself
    borderRadius: 25, // More rounded for the individual button
  },
  focusedButton: {
    backgroundColor: '#007AFF', // Blue background for focused button
  },
  unfocusedButton: {
    backgroundColor: 'transparent', // No background for unfocused button
  },
  focusedIconWrapper: {
    // No specific wrapper needed if icon is directly colored
  },
  unfocusedIconWrapper: {
    // No specific wrapper needed if icon is directly colored
  },
  focusedLabel: {
    color: '#FFFFFF', // White text for focused label
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8, // Space between icon and text
  },
  // You might need to adjust tabBarStyle to remove default padding
});

export default CustomTabButton;