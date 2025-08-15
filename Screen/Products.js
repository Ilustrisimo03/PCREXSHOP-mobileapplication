import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar, 
  Platform
} from 'react-native';
import { useFonts } from 'expo-font'; // Import the useFonts hook
import { useCart } from '../context/CartContext'; // Already imported, great!
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import data
import Item from '../data/Item.json';

// Import components
import CategoryList from '../Components/CategoryList';
import ProductCard from '../Components/ProductCard';

// THEME constant
const THEME = {
  primary: '#E31C25',
  background: '#FFFFFF',
  text: '#1C1C1C',
  cardBackground: '#FFFFFF',
  icons: '#FFFFFF'
};

const Products = ({ navigation }) => {

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
  

  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts] = useState(Item);
  const [filteredProducts, setFilteredProducts] = useState(Item);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { itemCount } = useCart();

  // Initial data loading for categories
  useEffect(() => {
    const uniqueCategories = ['All', ...new Set(Item.map(item => item.category.name))];
    setCategories(uniqueCategories);
  }, []);

  // Effect to filter products based on search and category
  useEffect(() => {
    let result = allProducts;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category.name.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, allProducts]);

  const renderProduct = ({ item }) => (
    <View style={styles.gridCardContainer}>
      <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { product: item })} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color={THEME.cardBackground} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Icon name="magnify" size={22} color="#888" style={{ marginLeft: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search all products..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* --- UPDATED CART ICON WITH BADGE --- */}
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                          <View>
                            <Icon name="cart-outline" size={28} color={THEME.icons} />
                            {itemCount > 0 && (
                              <View style={styles.badgeContainer}>
                                <Text style={styles.badgeText}>{itemCount}</Text>
                              </View>
                            )}
                          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="account-outline" size={28} color={THEME.cardBackground} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

     <CategoryList categories={categories} navigation={navigation} />

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        ListEmptyComponent={
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No Products Found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
    backgroundColor: THEME.background

  },
  header: {
    backgroundColor: THEME.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBackground,
    borderRadius: 8,
    height: 40
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: 'Roboto-Regular', 
    color: THEME.text
  },
  headerIcon: {
    marginLeft: 4
  },
  // --- ADDED STYLES FOR THE BADGE ---
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: THEME.background,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.primary
  },
  badgeText: {
    color: THEME.primary,
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  gridCardContainer: {
    width: '50%',
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  noResultsText: {
    fontSize: 16,
    color: '#6c757d',
    fontFamily: 'Roboto-Medium', 
  },
});

export default Products;