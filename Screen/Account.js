import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font'; // Import the useFonts hook

// The component now accepts the 'navigation' prop
const Account = ({ navigation }) => {

   // Load custom fonts
            const [fontsLoaded] = useFonts({
              'Roboto-Regular': require('../assets/fonts/Roboto/static/Roboto_Condensed-Regular.ttf'),
              'Roboto-Bold': require('../assets/fonts/Roboto/static/Roboto_Condensed-Bold.ttf'),
              'Roboto-Medium': require('../assets/fonts/Roboto/static/Roboto_Condensed-Medium.ttf'),
              'Roboto-SemiBold': require('../assets/fonts/Roboto/static/Roboto_Condensed-SemiBold.ttf'), // Make sure this font file exists
            });
      
      
            
          // Wait until the fonts are loaded before rendering the screen
        if (!fontsLoaded) {
          return null; // Or you can return a loading indicator here
        }

  // This function will handle the logout action
  const handleLogout = () => {
    navigation.replace('HomeScreen');
  };
  
  const handleTopay = () => {
    navigation.replace('Cart');
  };

  const handleToship = () => {
    navigation.replace('To ship');
  };

  const handleToreceive = () => {
    navigation.replace('To receive');
  };

  const handleToreview = () => {
    navigation.replace('To review');
  };

  const handleEditprofile = () => {
    navigation.replace('Edit profile');
  };
  
  const handleShippingaddress = () => {
    navigation.replace('Shipping address');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          {/* You can replace this with an <Image> component */}
        </View>
        <Text style={styles.username}>Username</Text>
      </View>

      <View style={styles.ordersSection}>
        <Text style={styles.sectionTitle}>My Orders</Text>
        <View style={styles.orderStatusContainer}>
          <TouchableOpacity style={styles.orderStatusItem} onPress={handleTopay}>
            <Icon name="wallet-outline" size={30} color="#E31C25" />
            <Text style={styles.orderStatusText}>To Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderStatusItem} onPress={handleToship}>
            <Icon name="package-variant-closed" size={30} color="#E31C25" />
            <Text style={styles.orderStatusText}>To Ship</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderStatusItem}onPress={handleToreceive}>
            <Icon name="truck-delivery-outline" size={30} color="#E31C25" />
            <Text style={styles.orderStatusText}>To Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderStatusItem} onPress={handleToreview}>
            <Icon name="message-draw" size={30} color="#E31C25" />
            <Text style={styles.orderStatusText}>To Review</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEditprofile}>
          <Icon name="account-outline" size={22} color="#1C1C1C" />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShippingaddress}>
          <Icon name="map-marker-outline" size={22} color="#1C1C1C" />
          <Text style={styles.actionButtonText}>Shipping Address</Text>
        </TouchableOpacity>
        {/* The onPress handler is updated to call handleLogout */}
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Icon name="logout" size={22} color="#1C1C1C" />
          <Text style={styles.actionButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBFA',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: '#1C1C1C',
  },
  ordersSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#1C1C1C',
    marginBottom: 20,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  orderStatusItem: {
    alignItems: 'center',
  },
  orderStatusText: {
    marginTop: 6,
    fontSize: 12,
    color: '#555',
    fontFamily: 'Roboto-Regular',
  },
  actionsSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    marginBottom: 15,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#1C1C1C',
    marginLeft: 15,
    fontFamily: 'Roboto-Regular',
  },
});

export default Account;