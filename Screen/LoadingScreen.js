import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mag-navigate sa SignIn_SignUp screen pagkatapos ng 3 segundo
      navigation.replace('SingIn_SignUp');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>PCREXSHOP</Text>
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 20,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  spinner: {
    marginTop: 20,
  },
});

export default LoadingScreen;