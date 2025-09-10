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
  Alert, // <-- We will remove this for the modal we are replacing
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import CustomAlertModal from '../Components/CustomAlertModal'; 

// THEME (remains the same)
const THEME = {
  primary: '#EE2323',
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  text: '#1C1C1C',
  subText: '#666666',
  borderColor: '#E0E0E0',
  success: '#28A745',
  warning: '#FFC107',
};

const SHIPPING_FEE = 38.0;

const Checkout = ({ route, navigation }) => {
  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('../assets/fonts/Rubik/static/Rubik-Regular.ttf'),
    'Rubik-Bold': require('../assets/fonts/Rubik/static/Rubik-Bold.ttf'),
    'Rubik-Medium': require('../assets/fonts/Rubik/static/Rubik-Medium.ttf'),
    'Rubik-SemiBold': require('../assets/fonts/Rubik/static/Rubik-SemiBold.ttf'),
  });

  const { cartItems, clearCart } = useCart();
  const { placeOrder } = useOrders();

  const itemsFromRoute = route.params?.items;
  const isDirectBuy = !!itemsFromRoute;
  const checkoutItems = isDirectBuy ? itemsFromRoute : cartItems;

  const [paymentMethod, setPaymentMethod] = useState(null); // 'cod' or 'gcash'

  // Pre-filled Shipping Address
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [fullName, setFullName] = useState('Juan Dela Cruz');
  const [address, setAddress] = useState('123 Main St, Brgy. Central');
  const [city, setCity] = useState('Quezon City, 1100');
  const [phoneNumber, setPhoneNumber] = useState('09123456789');

  // State for Modals
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);
  const [showIncompleteAddressModal, setShowIncompleteAddressModal] = useState(false);
  const [showEmptyOrderModal, setShowEmptyOrderModal] = useState(false);
  const [showPaymentMethodRequiredModal, setShowPaymentMethodRequiredModal] = useState(false);


  // Totals (remains the same)
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
    0
  );
  const finalShippingFee = subtotal > 0 ? SHIPPING_FEE : 0.0;
  const total = subtotal + finalShippingFee;

  if (!fontsLoaded) return null;

  const handlePlaceOrder = () => {
    if (checkoutItems.length === 0) {
      setShowEmptyOrderModal(true); // Show modal instead of Alert
      return;
    }

    if (!fullName.trim() || !address.trim() || !city.trim() || !phoneNumber.trim()) {
      setShowIncompleteAddressModal(true); // Show modal
      return;
    }

    if (!paymentMethod) {
      setShowPaymentMethodRequiredModal(true); // Show modal
      return;
    }

    setShowConfirmOrderModal(true); // Show custom confirmation modal
  };

  const confirmOrderAction = () => {
    setShowConfirmOrderModal(false); // Hide modal
    const orderDetails = {
      items: checkoutItems,
      shippingAddress: { fullName, address, city, phoneNumber },
      paymentMethod: paymentMethod,
      subtotal: subtotal,
      shippingFee: finalShippingFee,
      total: total,
      orderDate: new Date().toISOString(),
    };

    placeOrder(orderDetails);
    if (!isDirectBuy) clearCart();
    navigation.navigate('OrderSuccess');
  };

  // ... rest of your component code

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />

      {/* Header (remains the same) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color={THEME.cardBackground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Shipping Address (remains the same) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Shipping Address</Text>
            <TouchableOpacity onPress={() => setIsEditingAddress(!isEditingAddress)}>
              <Text style={styles.editButtonText}>{isEditingAddress ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          {isEditingAddress ? (
            <View>
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
          ) : (
            <View style={styles.addressDisplay}>
              <Text style={styles.addressText}>
                <Text style={styles.addressLabel}>Name:</Text> {fullName}
              </Text>
              <Text style={styles.addressText}>
                <Text style={styles.addressLabel}>Address:</Text> {address}
              </Text>
              <Text style={styles.addressText}>
                <Text style={styles.addressLabel}>City:</Text> {city}
              </Text>
              <Text style={styles.addressText}>
                <Text style={styles.addressLabel}>Phone:</Text> {phoneNumber}
              </Text>
            </View>
          )}
        </View>

        {/* Payment Method (remains the same) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentOption} onPress={() => setPaymentMethod('cod')}>
            <Icon
              name={paymentMethod === 'cod' ? 'radiobox-marked' : 'radiobox-blank'}
              size={22}
              color={paymentMethod === 'cod' ? THEME.primary : THEME.borderColor}
            />
            <Text style={styles.paymentOptionText}>Cash on Delivery (COD)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption} onPress={() => setPaymentMethod('gcash')}>
            <Icon
              name={paymentMethod === 'gcash' ? 'radiobox-marked' : 'radiobox-blank'}
              size={22}
              color={paymentMethod === 'gcash' ? THEME.primary : THEME.borderColor}
            />
            <Text style={styles.paymentOptionText}>GCASH</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary (remains the same) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          {checkoutItems.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.itemContainer}>
              <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity || 1}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ₱
                {parseFloat(item.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Details (remains the same) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>
              ₱
              {subtotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Fee</Text>
            <Text style={styles.priceValue}>
              ₱
              {finalShippingFee.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ₱
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar (remains the same) */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.bottomTotalValue}>
            ₱
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modals */}
      <CustomAlertModal
        isVisible={showConfirmOrderModal}
        title="Confirm Order"
        message={`Are you sure you want to place this order?\nTotal: ₱${total.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        onConfirm={confirmOrderAction}
        onCancel={() => setShowConfirmOrderModal(false)}
        confirmText="Place Order"
        type="confirm"
      />

      <CustomAlertModal
        isVisible={showEmptyOrderModal}
        title="Empty Order"
        message="There are no items to check out."
        onConfirm={() => setShowEmptyOrderModal(false)}
        type="warning"
        cancelText={null} // Only show one button
      />

      <CustomAlertModal
        isVisible={showIncompleteAddressModal}
        title="Incomplete Address"
        message="Please fill in all shipping address fields."
        onConfirm={() => setShowIncompleteAddressModal(false)}
        type="error"
        cancelText={null}
      />

      <CustomAlertModal
        isVisible={showPaymentMethodRequiredModal}
        title="Payment Method Required"
        message="Please select a payment method to proceed."
        onConfirm={() => setShowPaymentMethodRequiredModal(false)}
        type="error"
        cancelText={null}
      />
    </SafeAreaView>
  );
};

// Styles (remains the same)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    backgroundColor: THEME.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: { fontSize: 20, fontFamily: 'Rubik-Bold', color: THEME.cardBackground },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: THEME.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: THEME.borderColor,
    paddingBottom: 10,
  },
  cardTitle: { fontSize: 18, fontFamily: 'Rubik-SemiBold', color: THEME.text },
  editButtonText: { fontSize: 14, fontFamily: 'Rubik-Medium', color: THEME.primary },
  addressDisplay: { marginTop: 5 },
  addressText: {
    fontSize: 15,
    fontFamily: 'Rubik-Regular',
    color: THEME.subText,
    marginBottom: 6,
  },
  addressLabel: { fontFamily: 'Rubik-Medium', color: THEME.text },
  input: {
    borderWidth: 1,
    borderColor: THEME.borderColor,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    fontFamily: 'Rubik-Regular',
    fontSize: 15,
    color: THEME.text,
    backgroundColor: THEME.background,
  },
  paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginBottom: 5 },
  paymentOptionText: { marginLeft: 15, fontSize: 16, fontFamily: 'Rubik-Regular', color: THEME.text },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.borderColor,
    marginBottom: 10,
  },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  itemDetails: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 15, fontFamily: 'Rubik-Medium', color: THEME.text, marginBottom: 4 },
  itemQuantity: { fontSize: 14, fontFamily: 'Rubik-Regular', color: THEME.subText },
  itemPrice: { fontSize: 15, fontFamily: 'Rubik-Bold', color: THEME.text },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceLabel: { fontSize: 15, fontFamily: 'Rubik-Regular', color: THEME.subText },
  priceValue: { fontSize: 15, fontFamily: 'Rubik-Medium', color: THEME.text },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.borderColor,
  },
  totalLabel: { fontSize: 16, fontFamily: 'Rubik-SemiBold', color: THEME.text },
  totalValue: { fontSize: 16, fontFamily: 'Rubik-Bold', color: THEME.primary },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.cardBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: THEME.borderColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 8,
  },
  bottomPriceContainer: { flexDirection: 'column' },
  bottomTotalValue: { fontSize: 18, fontFamily: 'Rubik-Bold', color: THEME.primary, marginTop: 4 },
  placeOrderButton: {
    backgroundColor: THEME.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  placeOrderButtonText: { fontSize: 16, fontFamily: 'Rubik-Bold', color: THEME.cardBackground, textAlign: 'center' },
});

export default Checkout;
