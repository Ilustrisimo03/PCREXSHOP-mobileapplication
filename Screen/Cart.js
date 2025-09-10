import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Image, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import { useCart } from '../context/CartContext';
import { Swipeable } from 'react-native-gesture-handler';

const Cart = ({ navigation }) => {
  const { cartItems, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  
  // State to track selected items for checkout
  const [selectedItems, setSelectedItems] = useState(new Set());

  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('../assets/fonts/Rubik/static/Rubik-Regular.ttf'),
    'Rubik-Bold': require('../assets/fonts/Rubik/static/Rubik-Bold.ttf'),
    'Rubik-Medium': require('../assets/fonts/Rubik/static/Rubik-Medium.ttf'),
    'Rubik-SemiBold': require('../assets/fonts/Rubik/static/Rubik-SemiBold.ttf'),
  });

  // Toggle selection for an item
  const handleToggleSelection = (itemId) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };
  
  // Calculate total price and count ONLY for selected items
  const { selectedTotalPrice, selectedItemCount } = useMemo(() => {
    let total = 0;
    let count = 0;
    cartItems.forEach(item => {
      if (selectedItems.has(item.id)) {
        total += parseFloat(item.price) * item.quantity;
        count += item.quantity;
      }
    });
    return { selectedTotalPrice: total, selectedItemCount: count };
  }, [cartItems, selectedItems]);


  const handleProceedToCheckout = () => {
    if (selectedItems.size === 0) {
      Alert.alert("No Items Selected", "Please select items to proceed to checkout.");
      return;
    }
    const itemsToCheckout = cartItems.filter(item => selectedItems.has(item.id));
    // Pass only the selected items to the checkout screen
    navigation.navigate('Checkout', { items: itemsToCheckout }); 
  };
  
  if (!fontsLoaded) {
    return null;
  }

  const renderRightActions = (progress, dragX, item) => {
    const trans = dragX.interpolate({ inputRange: [-80, 0], outputRange: [0, 80], extrapolate: 'clamp' });
    return (
      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
        <Animated.View style={[styles.deleteButtonContent, { transform: [{ translateX: trans }] }]}>
          <Icon name="trash-can" size={24} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderCartItem = ({ item }) => (
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => handleToggleSelection(item.id)}>
          <Icon 
            name={selectedItems.has(item.id) ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={24}
            color={selectedItems.has(item.id) ? '#22c55e' : '#9ca3af'}
            style={styles.checkbox}
          />
        </TouchableOpacity>
        <Image
            source={{ uri: item.images && item.images.length > 0 ? item.images[0] : undefined }}
            style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.itemPrice}>₱{parseFloat(item.price).toFixed(2)}</Text>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => item.quantity === 1 ? removeFromCart(item.id) : decreaseQuantity(item.id)}
          >
            <Icon name={item.quantity === 1 ? "trash-can-outline" : "minus"} size={20} color="#E31C25" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => increaseQuantity(item.id)}>
            <Icon name="plus" size={20} color="#22c55e" />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color="#1C1C1C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
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
              <Text style={styles.totalLabel}>Total ({selectedItemCount} items):</Text>
              <Text style={styles.totalPrice}>₱{selectedTotalPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.checkoutButton, selectedItems.size === 0 && styles.checkoutButtonDisabled]} 
              onPress={handleProceedToCheckout}
              disabled={selectedItems.size === 0}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EAEAEA', backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 18, fontFamily: 'Rubik-SemiBold', color: "#1C1C1C" },
  clearAllButtonText: { fontFamily: 'Rubik-Medium', fontSize: 14, color: '#E31C25' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyText: { marginTop: 20, fontSize: 22, fontFamily: 'Rubik-SemiBold', color: '#333' },
  subText: { fontSize: 16, color: '#888', fontFamily: 'Rubik-Regular', textAlign: 'center', marginTop: 8 },
  shopButton: { marginTop: 30, backgroundColor: '#E31C25', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  shopButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Rubik-SemiBold' },
  listContentContainer: { paddingBottom: 150 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  checkbox: { marginRight: 12 },
  itemImage: { width: 90, height: 90, borderRadius: 8, backgroundColor: '#f0f0f0', marginRight: 12 },
  itemDetails: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 20, fontFamily: 'Rubik-Medium', color: '#1C1C1C', marginBottom: 4 },
  itemPrice: { fontSize: 18, fontFamily: 'Rubik-Bold', color: '#E31C25' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
  quantityButton: { padding: 4, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6 },
  quantityText: { fontSize: 16, fontFamily: 'Rubik-Bold', color: '#1C1C1C', marginHorizontal: 14 },
  separator: { height: 1, backgroundColor: '#F0F0F0' },
  deleteButton: { backgroundColor: '#E31C25', justifyContent: 'center', alignItems: 'center', width: 80 },
  deleteButtonContent: { justifyContent: 'center', alignItems: 'center', width: 80, height: '100%' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#e2e8f0', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { fontSize: 18, fontFamily: 'Rubik-Regular', color: '#333' },
  totalPrice: { fontSize: 22, fontFamily: 'Rubik-Bold', color: '#E31C25' },
  checkoutButton: { backgroundColor: '#22c55e', paddingVertical: 14, borderRadius: 15, alignItems: 'center' },
  checkoutButtonDisabled: { backgroundColor: '#9ca3af' },
  checkoutButtonText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Rubik-Bold' }
});

export default Cart;