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


import { View, Text } from 'react-native'
import React from 'react'

const SignIn_SignUp = () => {
  return (
    <View>
      <Text>SignIn_SignUp</Text>
    </View>
  )
}

export default SignIn_SignUp