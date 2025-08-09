import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// THEME (Gayahin mula sa Home screen para pare-pareho)
const THEME = {
  primary: '#EE2323',
  background: '#FFFFFF',
  text: '#1C1C1C',
};

const ProductDetails = ({ route, navigation }) => {
  // Kunin ang product data na ipinasa mula sa Home screen
  const { product } = route.params;

  // Placeholder function para sa Add to Cart
  const handleAddToCart = () => {
    // DITO MO ILALAGAY ANG LOGIC PARA SA STATE MANAGEMENT (CONTEXT API / REDUX)
    // Sa ngayon, magpapakita muna tayo ng alert.
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Icon name="cart-outline" size={28} color={THEME.text} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Product Image */}
        <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
        
        <View style={styles.detailsContainer}>
          {/* Product Name */}
          <Text style={styles.productName}>{product.name}</Text>
          
          {/* Product Price */}
          <Text style={styles.productPrice}>₱ {parseFloat(product.price).toLocaleString()}</Text>
          
          {/* Product Rating */}
          <View style={styles.ratingContainer}>
            <Icon name="star" size={20} color="#FFC700" />
            <Text style={styles.ratingText}>{product.rate} stars</Text>
          </View>
          
          {/* Product Description */}
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Bottom Bar: Add to Cart */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Icon name="cart-plus" size={22} color={THEME.background} />
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.text },
  productImage: { width: '100%', height: 300, backgroundColor: '#F3F4F6' },
  detailsContainer: { paddingHorizontal: 20, paddingVertical: 20 },
  productName: { fontSize: 24, fontWeight: 'bold', color: THEME.text, marginBottom: 8 },
  productPrice: { fontSize: 22, fontWeight: '700', color: THEME.primary, marginBottom: 16 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  ratingText: { marginLeft: 8, fontSize: 16, color: '#555' },
  descriptionTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.text, marginBottom: 8 },
  descriptionText: { fontSize: 15, color: '#333', lineHeight: 22 },
  bottomBar: { padding: 16, borderTopWidth: 1, borderTopColor: '#EAEAEA', backgroundColor: THEME.background },
  addToCartButton: { backgroundColor: THEME.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 15, borderRadius: 12 },
  addToCartButtonText: { color: THEME.background, fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});

export default ProductDetails;