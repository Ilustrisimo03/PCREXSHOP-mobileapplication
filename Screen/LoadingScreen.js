import React, { useEffect, useRef } from 'react';
import { 
    View, 
    StyleSheet, 
    Animated, 
    Image, 
    StatusBar 
} from 'react-native';

const LoadingScreen = ({ navigation }) => {
  // useRef to store animated values for the logo and text
  const logoAnimation = useRef(new Animated.Value(0)).current;
  const textAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Navigate to home screen after animations have time to complete
    const navigationTimer = setTimeout(() => {
      navigation.replace('HomeScreen');
    }, 5000);

    // Start the animation sequence
    startAnimations();

    return () => clearTimeout(navigationTimer);
  }, [navigation]);

  const startAnimations = () => {
    // Use Animated.parallel to run multiple animations simultaneously
    Animated.parallel([
      // Animation for the logo (zoom in and fade in)
      Animated.timing(logoAnimation, {
        toValue: 1,
        duration: 1200, // Animation duration of 1.2 seconds
        useNativeDriver: true,
      }),
      // Animation for the text (slide up and fade in)
      Animated.timing(textAnimation, {
        toValue: 1,
        duration: 1000, // Slightly shorter duration
        delay: 500,    // Start after a 500ms delay
        useNativeDriver: true,
      })
    ]).start();
  };

  // Interpolated styles for the logo animation
  const logoAnimatedStyle = {
    opacity: logoAnimation,
    transform: [
      {
        scale: logoAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1], // Start at 80% size and scale to 100%
        }),
      },
    ],
  };

  // Interpolated styles for the text animation
  const textAnimatedStyle = {
    opacity: textAnimation,
    transform: [
      {
        translateY: textAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0], // Move up by 20 pixels
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor='#FFFFFF'/>
      <Animated.View style={logoAnimatedStyle}>
        <Image 
          source={require('../assets/pcrexlogo.png')} // Make sure this path is correct
          style={styles.logo} 
          resizeMode="contain"
        />
      </Animated.View>
      
      <Animated.Text style={[styles.logoText, textAnimatedStyle]}>
        PC Rex Shop
      </Animated.Text>
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 150, // Adjust width as needed
    height: 150, // Adjust height as needed
  },
  logoText: {
    color: '#1C1C1C',
    fontSize: 20,
    fontWeight: 'bold',
    bottom: 40,
  },
  
});

export default LoadingScreen;