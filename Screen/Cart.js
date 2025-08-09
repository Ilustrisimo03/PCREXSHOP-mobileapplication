import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Cart = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={28} color="#1C1C1C" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Cart</Text>
            <View style={{ width: 28 }} /> 
        </View>
        <View style={styles.content}>
            <Icon name="cart-remove" size={80} color="#CCCCCC" />
            <Text style={styles.emptyText}>Your cart is empty.</Text>
            <Text style={styles.subText}>Looks like you haven't added anything to your cart yet.</Text>
            <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: "#1C1C1C" },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyText: { marginTop: 20, fontSize: 22, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 8 },
  shopButton: { marginTop: 30, backgroundColor: '#EE2323', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  shopButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default Cart;