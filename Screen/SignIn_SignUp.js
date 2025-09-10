import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const SignIn_SignUp = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('../assets/fonts/Rubik/static/Rubik-Regular.ttf'),
    'Rubik-Bold': require('../assets/fonts/Rubik/static/Rubik-Bold.ttf'),
    'Rubik-Medium': require('../assets/fonts/Rubik/static/Rubik-Medium.ttf'),
    'Rubik-SemiBold': require('../assets/fonts/Rubik/static/Rubik-SemiBold.ttf'),
  });

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("user@gmail.com");
  const [password, setPassword] = useState("user12345");
  const [confirmPassword, setConfirmPassword] = useState("user12345");
  const [fullName, setFullName] = useState("User Joe");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States para sa custom modal/toast
  const [isAlertModalVisible, setAlertModalVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });
  const [onAcknowledge, setOnAcknowledge] = useState(null);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // BAGONG useEffect para awtomatikong isara ang modal
  useEffect(() => {
    if (isAlertModalVisible) {
      const timer = setTimeout(() => {
        setAlertModalVisible(false);
        // Isasagawa ang callback function pagkatapos isara ang modal
        if (typeof onAcknowledge === 'function') {
          onAcknowledge();
          setOnAcknowledge(null); // I-reset ang callback
        }
      }, 2500); // Mawawala pagkatapos ng 2.5 segundo

      // Cleanup function para iwasan ang memory leaks
      return () => clearTimeout(timer);
    }
  }, [isAlertModalVisible, onAcknowledge]);


  if (!fontsLoaded) {
    return null;
  }

  // Na-update na showAlert function
  const showAlert = (title, message, callback = null) => {
    setAlertConfig({ title, message });
    setOnAcknowledge(() => callback); // Itabi ang callback
    setAlertModalVisible(true);
  };

  const toggleMode = () => {
    setEmail(""); setPassword(""); setConfirmPassword(""); setFullName("");
    setIsLogin(!isLogin);
  };

  const handleLogin = () => {
    if (!email || !password) {
      showAlert("Login Error", "Please enter both email and password.");
      return;
    }
    showAlert("Login Successful", `Welcome back, ${email}!`, () => {
      navigation.navigate('HomeScreen');
    });
  };

  const handleSignUp = () => {
    if (!email || !password || !fullName) {
      showAlert("Sign Up Error", "Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      showAlert("Sign Up Error", "Passwords do not match. Please try again.");
      return;
    }
    showAlert("Sign Up Successful", "Your account has been created successfully.", () => {
      navigation.navigate('HomeScreen');
    });
  };

  const handleForgotPassword = () => {
    showAlert("Forgot Password", "Password recovery instructions sent to your email.");
  };

  const handleGoogleSignIn = () => {
    const action = isLogin ? "Sign-In" : "Sign-Up";
    showAlert(`Google ${action}`, `This feature is not yet implemented.`);
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          <Image source={require('../assets/pcrexlogo.png')} style={styles.brandImage} resizeMode="contain" />
          <Text style={styles.BrandName}>PC Rex Shop</Text>
          <Text style={styles.welcomeText}>{isLogin ? "Welcome Back!" : "Create an Account"}</Text>

          <View style={styles.formWrapper}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Icon name="account-outline" size={20} color="#888888" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
              </View>
            )}
            <View style={styles.inputGroup}>
              <Icon name="email-outline" size={20} color="#888888" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={styles.inputGroup}>
              <Icon name="lock-outline" size={20} color="#888888" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color="#888888" />
              </TouchableOpacity>
            </View>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Icon name="lock-outline" size={20} color="#888888" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Icon name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color="#888888" />
                </TouchableOpacity>
              </View>
            )}
            {isLogin && (<TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}><Text style={styles.forgotPasswordText}>Forgot password?</Text></TouchableOpacity>)}
            <TouchableOpacity style={styles.button} onPress={isLogin ? handleLogin : handleSignUp}><Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text></TouchableOpacity>
            <View style={styles.dividerContainer}><View style={styles.dividerLine} /><Text style={styles.dividerText}>Or continue with</Text><View style={styles.dividerLine} /></View>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}><Image source={require('../assets/google.png')} style={styles.googleIcon} /><Text style={styles.googleButtonText}>{isLogin ? 'Sign in with Google' : 'Sign up with Google'}</Text></TouchableOpacity>
          </View>

          <View style={styles.togglerContainer}>
            <Text style={styles.togglerText}>{isLogin ? "Don't have an account? " : "Already have an account? "}</Text>
            <TouchableOpacity onPress={toggleMode}><Text style={styles.togglerLink}>{isLogin ? 'Sign Up' : 'Sign In'}</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* === NA-UPDATE NA MODAL: PLAIN TEXT LANG AT WALANG BUTTON === */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAlertModalVisible}
        onRequestClose={() => setAlertModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertModalContainer}>
            <Text style={styles.alertModalTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertModalMessage}>{alertConfig.message}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// === NA-UPDATE NA STYLES PARA SA MODAL ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollViewContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  innerContainer: { alignItems: 'center', paddingHorizontal: 25 },
  brandImage: { width: '70%', height: 80 },
  BrandName: { fontSize: 14, fontFamily: 'Rubik-Medium', color: '#1C1C1C', bottom: 20 },
  welcomeText: { fontSize: 24, fontFamily: 'Rubik-SemiBold', color: '#1C1C1C', marginBottom: 30 },
  formWrapper: { width: '100%', alignItems: 'center' },
  inputGroup: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#ffffffff', borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 15, marginBottom: 15, paddingHorizontal: 12 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, fontFamily: 'Rubik-Regular', color: '#333333' },
  forgotPasswordContainer: { width: '100%', alignItems: 'flex-end', marginBottom: 15 },
  forgotPasswordText: { color: '#E31C25', fontSize: 14, fontFamily: 'Rubik-Medium' },
  button: { backgroundColor: '#E31C25', paddingVertical: 15, borderRadius: 15, alignItems: 'center', width: '100%', marginTop: 5 },
  buttonText: { fontSize: 16, fontFamily: 'Rubik-Bold', color: '#FFFFFF' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#DDDDDD' },
  dividerText: { marginHorizontal: 10, color: '#888888', fontSize: 14, fontFamily: 'Rubik-Regular' },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', paddingVertical: 12, borderRadius: 15, width: '100%', borderWidth: 1, borderColor: '#DDDDDD' },
  googleIcon: { width: 24, height: 24, marginRight: 15 },
  googleButtonText: { fontSize: 16, fontFamily: 'Rubik-Medium', color: '#333333' },
  togglerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  togglerText: { fontSize: 14, fontFamily: 'Rubik-Regular', color: '#555555' },
  togglerLink: { fontSize: 14, fontFamily: 'Rubik-Bold', color: '#E31C25', marginLeft: 5 },
  
  // Styles para sa bagong modal (parang toast/card)
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Ito ang nagpapagitna vertically
    alignItems: 'center',      // Ito ang nagpapagitna horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  alertModalContainer: {
    width: '90%',
    backgroundColor: '#333333', // Madilim na background para sa contrast
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  alertModalTitle: {
    fontSize: 16,
    fontFamily: 'Rubik-Bold',
    color: '#FFFFFF', // Puting text
    marginBottom: 5,
    textAlign: 'center',
  },
  alertModalMessage: {
    fontSize: 14,
    fontFamily: 'Rubik-Regular',
    color: '#E0E0E0', // Bahagyang gray na puti
    textAlign: 'center',
  },
});

export default SignIn_SignUp;