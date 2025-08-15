import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import { useCart } from '../context/CartContext';
import { Swipeable } from 'react-native-gesture-handler';

const Cart = ({ navigation }) => {
  const { cartItems, totalPrice, removeFromCart, clearCart } = useCart();

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto/static/Roboto_Condensed-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto/static/Roboto_Condensed-Bold.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto/static/Roboto_Condensed-Medium.ttf'),
    'Roboto-SemiBold': require('../assets/fonts/Roboto/static/Roboto_Condensed-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  // This function defines the "Delete" button that appears when you swipe left.
  const renderRightActions = (progress, dragX, item) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
        <Animated.View style={[styles.deleteButtonContent, { transform: [{ translateX: trans }] }]}>
          <Icon name="trash-can" size={24} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // The render function for each item now wraps the content in a Swipeable component.
  const renderCartItem = ({ item }) => (
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
        <View style={styles.itemContainer}>
            <Image
                source={{ uri: item.images && item.images.length > 0 ? item.images[0] : undefined }}
                style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemType}>{item.type}</Text>
            </View>
            <Text style={styles.itemPrice}>₱{parseFloat(item.price).toFixed(2)}</Text>
        </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#1C1C1C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        {/* The "Clear All" button only appears if there are items in the cart */}
        {cartItems.length > 0 ? (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearAllButtonText}>Clear All</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 28 }} />
        )}
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.content}>
          <Icon name="cart-remove" size={80} color="#CCCCCC" />
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <Text style={styles.subText}>Looks like you haven't added anything to your cart yet.</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('HomeScreen')}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContentContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total ({cartItems.length} items):</Text>
              <Text style={styles.totalPrice}>₱{totalPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#FFFFFF'
  },
  headerTitle: { fontSize: 18, fontFamily: 'Roboto-SemiBold', color: "#1C1C1C" },
  clearAllButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#E31C25',
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyText: { marginTop: 20, fontSize: 22, fontFamily: 'Roboto-SemiBold', color: '#333' },
  subText: { fontSize: 16, color: '#888', fontFamily: 'Roboto-Regular', textAlign: 'center', marginTop: 8 },
  shopButton: { marginTop: 30, backgroundColor: '#E31C25', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  shopButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Roboto-SemiBold' },
  listContentContainer: { paddingHorizontal: 0, paddingBottom: 150 }, // No horizontal padding here
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16, // Padding is now inside the item container
    backgroundColor: '#FFFFFF', // White background for the swipeable area
  },
  itemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#f0f0f0', marginRight: 12 },
  itemDetails: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 15, fontFamily: 'Roboto-Medium', color: '#1C1C1C' },
  itemType: { fontSize: 13, fontFamily: 'Roboto-Regular', color: '#64748b', marginTop: 4 },
  itemPrice: { fontSize: 16, fontFamily: 'Roboto-Bold', color: '#1C1C1C' },
  separator: { height: 1, backgroundColor: '#F0F0F0' },
  deleteButton: {
    backgroundColor: '#E31C25',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteButtonContent: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      height: '100%'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { fontSize: 18, fontFamily: 'Roboto-Regular', color: '#333' },
  totalPrice: { fontSize: 22, fontFamily: 'Roboto-Bold', color: '#E31C25' },
  checkoutButton: { backgroundColor: '#22c55e', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  checkoutButtonText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Roboto-Bold' }
});

export default Cart;