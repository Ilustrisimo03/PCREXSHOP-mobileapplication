// screens/Checkout.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext'; // <-- I-import ang useOrders

// THEME
const THEME = {
  primary: '#EE2323',
  background: '#FFFFFF',
  text: '#1C1C1C',
  lightGray: '#F3F4F6',
};

const Checkout = ({ navigation }) => {
  const { cartItems, clearCart } = useCart();
   const { placeOrder } = useOrders(); // <-- Kunin ang placeOrder function
  const [paymentMethod, setPaymentMethod] = useState(null); // 'cod' or 'gcash'

  // State for shipping address inputs
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Calculate prices
  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const shippingFee = subtotal > 0 ? 50.00 : 0.00; // Example shipping fee
  const total = subtotal + shippingFee;

  const handlePlaceOrder = () => {
    // 1. Check for empty cart
    if (cartItems.length === 0) {
        Alert.alert("Empty Cart", "You cannot place an order with an empty cart.");
        return;
    }

    // 2. Validate Shipping Address fields
    if (!fullName.trim() || !address.trim() || !city.trim() || !phoneNumber.trim()) {
        Alert.alert("Incomplete Address", "Please fill in all shipping address fields.");
        return;
    }

    // 3. Check for payment method selection
    if (!paymentMethod) {
        Alert.alert("Payment Method Required", "Please select a payment method to proceed.");
        return;
    }

    if (cartItems.length === 0 || !fullName.trim() || !address.trim() || !city.trim() || !phoneNumber.trim() || !paymentMethod) {
        // ... (error alerts)
        return;
    }

     Alert.alert(
      "Confirm Order",
      `Are you sure you want to place this order?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Place Order",
          onPress: () => {
            // Gumawa ng object na naglalaman ng lahat ng order details
            const orderDetails = {
              items: cartItems,
              shippingAddress: { fullName, address, city, phoneNumber },
              paymentMethod: paymentMethod,
              subtotal: subtotal,
              shippingFee: shippingFee,
              total: total,
            };

            // 1. Ilagay ang order sa OrderContext
            placeOrder(orderDetails);
            
            // 2. I-clear ang cart
            clearCart(); 
            
            // 3. Mag-navigate sa success screen
            navigation.navigate('OrderSuccess'); 
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Shipping Address */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shipping Address</Text>
          <TextInput 
            placeholder="Full Name" 
            style={styles.input} 
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput 
            placeholder="Address" 
            style={styles.input} 
            value={address}
            onChangeText={setAddress}
          />
          <TextInput 
            placeholder="City, Postal Code" 
            style={styles.input} 
            value={city}
            onChangeText={setCity}
          />
          <TextInput 
            placeholder="Phone Number" 
            style={styles.input} 
            keyboardType="phone-pad" 
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        
        {/* Payment Method */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment Method</Text>
            <TouchableOpacity style={styles.paymentOption} onPress={() => setPaymentMethod('cod')}>
                <Icon 
                    name={paymentMethod === 'cod' ? 'radiobox-marked' : 'radiobox-blank'} 
                    size={24} 
                    color={paymentMethod === 'cod' ? THEME.primary : '#AAA'}
                />
                <Text style={styles.paymentOptionText}>Cash on Delivery (COD)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentOption} onPress={() => setPaymentMethod('gcash')}>
                <Icon 
                    name={paymentMethod === 'gcash' ? 'radiobox-marked' : 'radiobox-blank'} 
                    size={24} 
                    color={paymentMethod === 'gcash' ? THEME.primary : '#AAA'}
                />
                <Text style={styles.paymentOptionText}>GCASH</Text>
            </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          {cartItems.map(item => (
            <View key={item.id} style={styles.itemContainer}>
              <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemPrice}>₱{parseFloat(item.price).toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₱{subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Fee</Text>
            <Text style={styles.priceValue}>₱{shippingFee.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₱{total.toLocaleString()}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
            <Text style={styles.priceLabel}>Total Price</Text>
            <Text style={styles.totalValue}>₱{total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.lightGray },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: THEME.background, borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
    headerTitle: { fontSize: 20, fontFamily: 'Roboto-Medium', color: THEME.text },
    scrollContainer: { padding: 16, paddingBottom: 100 },
    card: { backgroundColor: THEME.background, borderRadius: 12, padding: 16, marginBottom: 16 },
    cardTitle: { fontSize: 18, fontFamily: 'Roboto-Medium', color: THEME.text, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: THEME.lightGray, paddingBottom: 8 },
    input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, fontFamily: 'Roboto-Regular' },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    paymentOptionText: {
        marginLeft: 12,
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        color: THEME.text
    },
    itemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    itemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
    itemDetails: { flex: 1 },
    itemName: { fontFamily: 'Roboto-Regular', color: THEME.text },
    itemPrice: { fontFamily: 'Roboto-Medium', color: THEME.text, marginTop: 4 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: THEME.lightGray },
    priceLabel: { fontFamily: 'Roboto-Regular', color: '#666' },
    priceValue: { fontFamily: 'Roboto-Medium', color: THEME.text },
    totalLabel: { fontFamily: 'Roboto-Bold', fontSize: 16, color: THEME.text },
    totalValue: { fontFamily: 'Roboto-Bold', fontSize: 18, color: THEME.primary },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderTopWidth: 1, borderTopColor: '#EAEAEA', backgroundColor: THEME.background },
    bottomPriceContainer: { flex: 1 },
    placeOrderButton: { backgroundColor: THEME.primary, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 10, flex: 1, alignItems: 'center' },
    placeOrderButtonText: { color: THEME.background, fontSize: 16, fontFamily: 'Roboto-SemiBold' },
});

export default Checkout;