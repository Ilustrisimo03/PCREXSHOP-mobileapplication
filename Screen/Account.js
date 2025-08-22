import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font'; // Import the useFonts hook

import { useOrders } from '../context/OrderContext'; // Import useOrders
import { useMemo } from 'react';


// The component now accepts the 'navigation' prop
const Account = ({ navigation }) => {

   // Load custom fonts
            const [fontsLoaded] = useFonts({
              'Roboto-Regular': require('../assets/fonts/Roboto/static/Roboto_Condensed-Regular.ttf'),
              'Roboto-Bold': require('../assets/fonts/Roboto/static/Roboto_Condensed-Bold.ttf'),
              'Roboto-Medium': require('../assets/fonts/Roboto/static/Roboto_Condensed-Medium.ttf'),
              'Roboto-SemiBold': require('../assets/fonts/Roboto/static/Roboto_Condensed-SemiBold.ttf'), // Make sure this font file exists
            });
  

    const { orders } = useOrders();

    // Gumamit ng useMemo para bilangin lang kapag nagbago ang orders
    const getOrderCountByStatus = (status) => {
        return useMemo(() => orders.filter(order => order.status === status).length, [orders]);
    };

const toPayCount = getOrderCountByStatus('To Pay');
    const toShipCount = getOrderCountByStatus('To Ship');
    const toReceiveCount = getOrderCountByStatus('To Receive');
    const toReviewCount = getOrderCountByStatus('To Review');

    // ... (navigation handlers)
    const handleTopay = () => navigation.navigate('ToPay');
    const handleToship = () => navigation.navigate('ToShip');
    const handleToreceive = () => navigation.navigate('ToReceive');
    const handleToreview = () => navigation.navigate('ToReview');
    const handleEditprofile = () => navigation.navigate('EditProfile');
    const handleShippingaddress = () => navigation.navigate('ShippingAddress');

    // Bagong function para sa pag-navigate sa ViewOrder screen
    const handleViewPurchaseHistory = () => {
        navigation.navigate('ViewOrder');
    };

    const handleLogout = () => {
        navigation.replace('HomeScreen');
    };

    if (!fontsLoaded) {
        return null; 
    }


  return (
    <ScrollView style={styles.container}>
            {/* ... (profileSection) ... */}
             <View style={styles.profileSection}>
                <View style={styles.avatar}>
                {/* You can replace this with an <Image> component */}
                </View>
                <Text style={styles.username}>Username</Text>
            </View>

            <View style={styles.ordersSection}>
                {/* --- ITO ANG BAGONG SECTION HEADER --- */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>My Orders</Text>
                    <TouchableOpacity style={styles.ViewButton} onPress={handleViewPurchaseHistory}>
                        <Text style={styles.viewHistoryText}>View Purchase History </Text>
                        <Icon name="chevron-right" size={20} color="#E31C25" />
                    </TouchableOpacity>
                </View>
                {/* ------------------------------------ */}

                <View style={styles.orderStatusContainer}>
                    <TouchableOpacity style={styles.orderStatusItem} onPress={handleTopay}>
                        {toPayCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{toPayCount}</Text></View>}
                        <Icon name="wallet-outline" size={30} color="#E31C25" />
                        <Text style={styles.orderStatusText}>To Pay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.orderStatusItem} onPress={handleToship}>
                        {toShipCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{toShipCount}</Text></View>}
                        <Icon name="package-variant-closed" size={30} color="#E31C25" />
                        <Text style={styles.orderStatusText}>To Ship</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.orderStatusItem} onPress={handleToreceive}>
                        {toReceiveCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{toReceiveCount}</Text></View>}
                        <Icon name="truck-delivery-outline" size={30} color="#E31C25" />
                        <Text style={styles.orderStatusText}>To Receive</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.orderStatusItem} onPress={handleToreview}>
                        {toReviewCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{toReviewCount}</Text></View>}
                        <Icon name="message-draw" size={30} color="#E31C25" />
                        <Text style={styles.orderStatusText}>To Review</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ... (actionsSection) ... */}
            <View style={styles.actionsSection}>
                <TouchableOpacity style={styles.actionButton} onPress={handleEditprofile}>
                <Icon name="account-outline" size={22} color="#1C1C1C" />
                <Text style={styles.actionButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleShippingaddress}>
                <Icon name="map-marker-outline" size={22} color="#1C1C1C" />
                <Text style={styles.actionButtonText}>Shipping Address</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
                <Icon name="logout" size={22} color="#1C1C1C" />
                <Text style={styles.actionButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// Idagdag ang mga bago at in-update na styles
const styles = StyleSheet.create({
    // ... (lahat ng dati mong styles) ...
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
    ViewButton: {flexDirection: 'row',   alignItems: 'center',  },
    ordersSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionHeader: { // Bagong style
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        color: '#1C1C1C',
    },
    viewHistoryText: { // Bagong style
        fontSize: 13, fontFamily: 'Roboto-SemiBold', color: '#888',
    },
    orderStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    orderStatusItem: {
        alignItems: 'center',
        width: 70, // Para magkaroon ng space ang badge
    },
    badge: { // Bagong style para sa notification count
        position: 'absolute',
        top: -5,
        right: 5,
        backgroundColor: '#EE2323',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    badgeText: { // Bagong style
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
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