import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert, // We'll replace this with our custom toast
    Image,
    StatusBar,
    SafeAreaView,
    Platform,
    Modal, // Import Modal for the toast overlay
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../context/UserContext';

// Custom Toast Component
const Toast = ({ message, isVisible, onHide }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onHide();
            }, 1500); 
            return () => clearTimeout(timer);
        }
    }, [isVisible, onHide]);

    if (!isVisible) return null;

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={isVisible}
            onRequestClose={onHide} // Handle Android back button
        >
            <View style={styles.toastOverlay}>
                <View style={styles.toastContainer}>
                    <Text style={styles.toastText}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

const EditProfile = ({ navigation }) => {
    const [fontsLoaded] = useFonts({
        'Rubik-Regular': require('../assets/fonts/Rubik/static/Rubik-Regular.ttf'),
        'Rubik-Bold': require('../assets/fonts/Rubik/static/Rubik-Bold.ttf'),
        'Rubik-Medium': require('../assets/fonts/Rubik/static/Rubik-Medium.ttf'),
        'Rubik-SemiBold': require('../assets/fonts/Rubik/static/Rubik-SemiBold.ttf'),
    });

    const { userProfile, updateUserProfile } = useUser();

    const [username, setUsername] = useState(userProfile.username);
    const [email, setEmail] = useState(userProfile.email);
    const [phone, setPhone] = useState(userProfile.phone);
    const [profileImage, setProfileImage] = useState(userProfile.profileImage);

    // State for the custom toast
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        setUsername(userProfile.username);
        setEmail(userProfile.email);
        setPhone(userProfile.phone);
        setProfileImage(userProfile.profileImage);
    }, [userProfile]);

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                // Use custom toast instead of Alert
                setToastMessage('Permission required: Please grant media library permissions.');
                setShowToast(true);
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleSaveChanges = () => {
        updateUserProfile({
            username,
            email,
            phone,
            profileImage,
        });

        // Use custom toast instead of Alert
        setToastMessage('Profile updated successfully!');
        setShowToast(true);

        // Optionally, you can still navigate back after the toast disappears
        // For this, you might adjust the toast's onHide callback or add a setTimeout here.
        // For now, let's keep it simple and just show the toast.
        // If you want to navigate back AFTER the toast, you'd move navigation.goBack() into the Toast's onHide.
        setTimeout(() => {
            navigation.goBack();
        }, 2000); // Navigate back after 2 seconds (adjust as needed)
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor='#074ec2' />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={styles.placeholderRight} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileImageContainer}>
                    <TouchableOpacity onPress={pickImage}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Icon name="account-circle-outline" size={100} color="#B0B0B0" />
                            </View>
                        )}
                        <View style={styles.cameraIconContainer}>
                            <Icon name="camera-plus-outline" size={22} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter your username"
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            placeholder="Enter your email"
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholder="Enter your phone number"
                            placeholderTextColor="#888"
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Custom Toast Component */}
            <Toast
                message={toastMessage}
                isVisible={showToast}
                onHide={() => setShowToast(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#074ec2',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Rubik-Medium',
        color: '#FFFFFF',
    },
    placeholderRight: {
        width: 38,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#EAEAEA',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 3,
    },
    avatarPlaceholder: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 3,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#074ec2',
        borderRadius: 25,
        padding: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    formSection: {
        paddingHorizontal: 25,
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 15,
        fontFamily: 'Rubik-Medium',
        color: '#555555',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 18,
        fontSize: 16,
        fontFamily: 'Rubik-Regular',
        color: '#333333',
        backgroundColor: '#FFFFFF',
    },
    saveButton: {
        backgroundColor: '#074ec2',
        paddingVertical: 16,
        marginHorizontal: 25,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Rubik-SemiBold',
    },
    // NEW TOAST STYLES
    toastOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    toastContainer: {
        backgroundColor: '#4BB543',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 25,
        alignItems: 'center',
    },
    toastText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
    },
});

export default EditProfile;