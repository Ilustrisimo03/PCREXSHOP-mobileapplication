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

// THEME
const THEME = {
  primary: '#EE2323',
  background: '#FFFFFF',
  text: '#1C1C1C',
};

// Kinukuha natin ang lapad ng screen para gawing full-width ang bawat image sa carousel
const { width: screenWidth } = Dimensions.get('window');

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;

  // State para malaman kung anong image ang kasalukuyang nakikita
  const [activeIndex, setActiveIndex] = useState(0);

  const handleAddToCart = () => {
    alert(`${product.name} has been added to your cart!`);
  };

  // Function na nag-u-update ng activeIndex tuwing nag-i-scroll
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
        <Text style={styles.headerTitle}>{product.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Icon name="cart-outline" size={28} color={THEME.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {/* --- IMAGE CAROUSEL SECTION --- */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={product.images}
            renderItem={({ item }) => (
              <Image 
                source={{ uri: item }} 
                // BINAGO: Mula 'contain' naging 'cover' para sakupin ang buong space
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
          {/* Indicator Dots */}
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
        
        {/* --- PRODUCT INFO SECTION --- */}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>₱ {parseFloat(product.price).toLocaleString()}</Text>
          
          {/* --- IDINAGDAG: Row para sa Rating at Stock --- */}
          <View style={styles.infoRowContainer}>
            {/* Rating */}
            <View style={styles.infoBox}>
                <Icon name="star" size={20} color="#FFC700" />
                <Text style={styles.infoText}>{product.rate} Stars</Text>
            </View>
            {/* Stock */}
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
    fontSize: 15, 
    fontWeight: '700', 
    color: THEME.text 
  },
  scrollContentContainer: {
    paddingBottom: 20,
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
    fontSize: 18, 
    fontWeight: 'bold', 
    color: THEME.text, 
    marginBottom: 8 
  },
  productPrice: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: THEME.primary, 
    marginBottom: 16 
  },
  // IDINAGDAG: Styles para sa bagong Info Row (Rating at Stock)
  infoRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    gap: 24, // Nagbibigay ng espasyo sa pagitan ng Rating at Stock
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  descriptionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: THEME.text, 
    marginBottom: 8,
    marginTop: 10, // Nagdagdag ng kaunting space bago ang Description
  },
  descriptionText: { 
    fontSize: 14, 
    color: '#333', 
    lineHeight: 22 
  },
  bottomBar: { 
    padding: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#EAEAEA', 
    backgroundColor: THEME.background 
  },
  addToCartButton: { 
    backgroundColor: THEME.primary, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderRadius: 12 
  },
  addToCartButtonText: { 
    color: THEME.background, 
    fontSize: 15, 
    fontWeight: 'bold', 
    marginLeft: 10 
  },
});

export default ProductDetails;