import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  FlatList,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import { useCart } from '../context/CartContext'; // Already imported, great!

// THEME
const THEME = {
  primary: '#EE2323',
  background: '#FFFFFF',
  text: '#1C1C1C',
};

const { width: screenWidth } = Dimensions.get('window');

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;
  // Destructure itemCount along with the other functions
  const { addToCart, buyNow, itemCount } = useCart();

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto/static/Roboto_Condensed-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto/static/Roboto_Condensed-Bold.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto/static/Roboto_Condensed-Medium.ttf'),
    'Roboto-SemiBold': require('../assets/fonts/Roboto/static/Roboto_Condensed-SemiBold.ttf'),
  });

  const [activeIndex, setActiveIndex] = useState(0);

  if (!fontsLoaded) {
    return null;
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    buyNow(product);
    navigation.navigate('Cart');
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
      if (viewableItems.length > 0) {
          setActiveIndex(viewableItems[0].index || 0);
      }
  }, []);

  const viewabilityConfig = {
      itemVisiblePercentThreshold: 50,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        
        {/* --- UPDATED CART ICON WITH BADGE --- */}
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <View>
            <Icon name="cart-outline" size={28} color={THEME.text} />
            {itemCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.carouselContainer}>
          <FlatList
            data={product.images}
            renderItem={({ item }) => (
              <Image 
                source={{ uri: item }} 
                style={styles.carouselImage} 
                resizeMode="cover" 
              />
            )}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
          <View style={styles.indicatorContainer}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  { backgroundColor: index === activeIndex ? THEME.primary : '#C4C4C4' }
                ]}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>₱ {parseFloat(product.price).toLocaleString()}</Text>
          
          <View style={styles.infoRowContainer}>
            <View style={styles.infoBox}>
                <Icon name="star" size={20} color="#FFC700" />
                <Text style={styles.infoText}>{product.rate} Stars</Text>
            </View>
            <View style={styles.infoBox}>
                <Icon name="package-variant-closed" size={20} color={THEME.primary} />
                <Text style={styles.infoText}>{product.stock} in stock</Text>
            </View>
          </View>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Icon name="cart-plus" size={22} color={THEME.background} />
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.buyNowButton} 
            onPress={handleBuyNow}
          >
            <Icon name="credit-card-outline" size={22} color={THEME.background} />
            <Text style={styles.buyNowButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: THEME.background 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EAEAEA' 
  },
  headerTitle: { 
    fontSize: 20, 
    fontFamily: 'Roboto-Medium', 
    color: THEME.text 
  },
  // --- ADDED STYLES FOR THE BADGE ---
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: THEME.primary,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.background
  },
  badgeText: {
    color: THEME.background,
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  carouselContainer: {
    height: 350,
    backgroundColor: '#F3F4F6',
  },
  carouselImage: {
    width: screenWidth,
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  detailsContainer: { 
    paddingHorizontal: 20, 
    paddingTop: 20 
  },
  productName: { 
    fontSize: 22,
    fontFamily: 'Roboto-Bold', 
    color: THEME.text, 
    marginBottom: 8 
  },
  productPrice: { 
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    color: THEME.primary, 
    marginBottom: 16 
  },
  infoRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Roboto-Regular',
  },
  descriptionTitle: { 
    fontSize: 18, 
    fontFamily: 'Roboto-Medium', 
    color: THEME.text, 
    marginBottom: 8,
    marginTop: 10,
  },
  descriptionText: { 
    fontSize: 15, 
    color: '#4A4A4A', 
    fontFamily: 'Roboto-Regular',
    lineHeight: 23 
  },
  bottomBar: { 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12, 
    paddingBottom: 20,
    borderTopWidth: 1, 
    borderTopColor: '#EAEAEA', 
    backgroundColor: THEME.background 
  },
  addToCartButton: { 
    backgroundColor: '#ff8c00',
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderRadius: 10,
    flex: 1,
    marginRight: 8
  },
  addToCartButtonText: { 
    color: THEME.background, 
    fontSize: 16, 
    fontFamily: 'Roboto-SemiBold', 
    marginLeft: 10 
  },
  buyNowButton: { 
    backgroundColor: THEME.primary, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderRadius: 10,
    flex: 1,
    marginLeft: 8
  },
  buyNowButtonText: { 
    color: THEME.background, 
    fontSize: 16, 
    fontFamily: 'Roboto-SemiBold',
    marginLeft: 10 
  },
});

export default ProductDetails;