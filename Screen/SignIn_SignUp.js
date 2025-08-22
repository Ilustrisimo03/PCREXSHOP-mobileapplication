// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Platform, // Inalis ang KeyboardAvoidingView
//   Image,
//   ScrollView,
//   SafeAreaView, // Idinagdag para sa mas magandang view sa iOS
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import * as Font from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';

// SplashScreen.preventAutoHideAsync();

// export default function SignIn_SignUp({ navigation }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [fontLoaded, setFontLoaded] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   useEffect(() => {
//     async function loadAssets() {
//       try {
//         await Font.loadAsync({
//           'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
//           'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
//         });
//         setFontLoaded(true);
//       } catch (error) {
//         console.error('Error loading font:', error);
//       } finally {
//         SplashScreen.hideAsync();
//       }
//     }
//     loadAssets();
//   }, []);

//   if (!fontLoaded) {
//     return null;
//   }

//   const toggleMode = () => {
//     setEmail(""); setPassword(""); setConfirmPassword(""); setFullName("");
//     setIsLogin(!isLogin);
//   };

//   const handleLogin = () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Please enter both email and password.");
//       return;
//     }
//     Alert.alert("Login Successful", `Welcome back, ${email}!`);
//     navigation.replace('MainApp');
//   };

//   const handleSignUp = () => {
//     if (!email || !password || !fullName) {
//       Alert.alert("Error", "Please fill all fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match.");
//       return;
//     }
//     Alert.alert("Sign Up Successful", "Your account has been created.");
//     navigation.replace('MainApp');
//   };

//   // Pinalitan ang KeyboardAvoidingView ng SafeAreaView at View
//   return (
    
//     <SafeAreaView style={styles.container}>
//        <StatusBar hidden={false} translucent={false} backgroundColor="transparent" />
//       <ScrollView
//         contentContainerStyle={styles.scrollViewContent}
//         keyboardShouldPersistTaps="handled" // Napakahalaga nito para gumana ang mga touch sa loob ng scrollview
//         showsVerticalScrollIndicator={false} // Opsyonal: para itago ang scroll bar
//       >
//         <View style={styles.innerContainer}>
//           <Image
//             source={require('../assets/pcrexlogo.png')}
//             style={styles.brandImage}
//             resizeMode="contain"
//           />
//           <Text style={styles.welcomeText}>{isLogin ? "Welcome Back!" : "Create Account"}</Text>

//           {/* Form Inputs */}
//           <View style={styles.formWrapper}>
//             {!isLogin && (
//               <View style={styles.inputGroup}>
//                 <Ionicons name="person-outline" size={20} color="#888888" style={styles.inputIcon} />
//                 <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
//               </View>
//             )}
//             <View style={styles.inputGroup}>
//               <Ionicons name="mail-outline" size={20} color="#888888" style={styles.inputIcon} />
//               <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
//             </View>
//             <View style={styles.inputGroup}>
//               <Ionicons name="lock-closed-outline" size={20} color="#888888" style={styles.inputIcon} />
//               <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
//               <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                 <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color="#888888" />
//               </TouchableOpacity>
//             </View>
//             {!isLogin && (
//               <View style={styles.inputGroup}>
//                 <Ionicons name="lock-closed-outline" size={20} color="#888888" style={styles.inputIcon} />
//                 <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} />
//                 <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
//                   <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color="#888888" />
//                 </TouchableOpacity>
//               </View>
//             )}

//             <TouchableOpacity style={styles.button} onPress={isLogin ? handleLogin : handleSignUp}>
//               <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.togglerContainer}>
//             <Text style={styles.togglerText}>{isLogin ? "Don't have an account? " : "Already have an account? "}</Text>
//             <TouchableOpacity onPress={toggleMode}>
//               <Text style={styles.togglerLink}>{isLogin ? 'Sign Up' : 'Login'}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // Walang pagbabago sa styles. Gamitin pa rin ang dating styles mo.
// const styles = StyleSheet.create({
//     // Ginamit ko ang SafeAreaView style sa container
//     container: { flex: 1, backgroundColor: '#FFFFFF' },
//     scrollViewContent: { flexGrow: 1, justifyContent: 'center' },
//     innerContainer: { alignItems: 'center', paddingHorizontal: 25, paddingVertical: 20 },
//     backButton: { position: 'absolute', top: 20, left: 15, zIndex: 10 },
//     brandImage: { width: '70%', height: 80, marginBottom: 20 },
//     welcomeText: { fontSize: 22, fontFamily: 'Poppins-SemiBold', color: '#333333', marginBottom: 25 },
//     formWrapper: { width: '100%', alignItems: 'center' },
//     inputGroup: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#F7F7F7', borderRadius: 8, marginBottom: 15, paddingHorizontal: 12, paddingVertical: 4 },
//     inputIcon: { marginRight: 10 },
//     input: { flex: 1, paddingVertical: 10, fontSize: 15, fontFamily: 'Poppins-Regular', color: '#333333' },
//     button: { backgroundColor: '#E31C25', paddingVertical: 15, borderRadius: 8, alignItems: 'center', width: '100%', marginTop: 10 },
//     buttonText: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#FFFFFF' },
//     togglerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 25 },
//     togglerText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#555555' },
//     togglerLink: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#E31C25', marginLeft: 5 },
// });



























import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Note: This component assumes you have:
// 1. A logo image at '../assets/pcrexlogo.png'
// 2. A Google logo image at '../assets/google.png'
// 3. A navigator that provides the 'navigation' prop.
// 4. Font files in the specified assets path.

const SignIn_SignUp = ({ navigation }) => {
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto/static/Roboto_Condensed-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto/static/Roboto_Condensed-Bold.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto/static/Roboto_Condensed-Medium.ttf'),
    'Roboto-SemiBold': require('../assets/fonts/Roboto/static/Roboto_Condensed-SemiBold.ttf'),
  });

  // State to toggle between Login and Sign Up views
  const [isLogin, setIsLogin] = useState(true);

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Hide the splash screen once the fonts have loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Do not render anything until the fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  // Function to switch between Login and Sign Up modes
  const toggleMode = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setIsLogin(!isLogin);
  };

  // Function to handle the login process
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Login Error", "Please enter both email and password.");
      return;
    }
    Alert.alert("Login Successful", `Welcome back, ${email}!`);
    navigation.replace('MainApp');
  };

  // Function to handle the sign-up process
  const handleSignUp = () => {
    if (!email || !password || !fullName) {
      Alert.alert("Sign Up Error", "Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Sign Up Error", "Passwords do not match. Please try again.");
      return;
    }
    Alert.alert("Sign Up Successful", "Your account has been created successfully.");
    navigation.replace('MainApp');
  };

  // Placeholder function for "Forgot Password"
  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password recovery instructions have been sent to your email.");
  };

  // Placeholder function for Google Sign-In
  const handleGoogleSignIn = () => {
    const action = isLogin ? "Sign-In" : "Sign-Up";
    Alert.alert(`Google ${action}`, `Google ${action} functionality is not yet implemented.`);
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
          <Image
            source={require('../assets/pcrexlogo.png')}
            style={styles.brandImage}
            resizeMode="contain"
          />
          
          <Text style={styles.BrandName}>
            PC Rex Shop
          </Text>

          <Text style={styles.welcomeText}>
            {isLogin ? "Welcome Back!" : "Create an Account"}
          </Text>

          <View style={styles.formWrapper}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Ionicons name="person-outline" size={20} color="#888888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={20} color="#888888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed-outline" size={20} color="#888888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color="#888888" />
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Ionicons name="lock-closed-outline" size={20} color="#888888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color="#888888" />
                </TouchableOpacity>
              </View>
            )}

            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.button} onPress={isLogin ? handleLogin : handleSignUp}>
              <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
              <Image
                source={require('../assets/google.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>
                {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.togglerContainer}>
            <Text style={styles.togglerText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.togglerLink}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  innerContainer: {
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  brandImage: {
    width: '70%',
    height: 80,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Roboto-SemiBold',
    color: '#1C1C1C',
    marginBottom: 30,
  },
  BrandName: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#1C1C1C',
    bottom: 20
  },
  formWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#ffffffff',
    borderWidth: 1, // Added border width
    borderColor: '#DDDDDD', // Added border color
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: '#333333',
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#E31C25',
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  button: {
    backgroundColor: '#E31C25',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDDDDD',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#888888',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#333333',
  },
  togglerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  togglerText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#555555',
  },
  togglerLink: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#E31C25',
    marginLeft: 5,
  },
});

export default SignIn_SignUp;