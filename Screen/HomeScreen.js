import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../context/CartContext'; // Already imported, great!
import { useFonts } from 'expo-font'; // Import the useFonts hook

// Import data
import Item from '../data/Item.json';

// Import components
import BannerSlider from '../Components/BannerSlider';
import CategoryList from '../Components/CategoryList';
import ProductSection from '../Components/ProductSection';
import ProductCard from '../Components/ProductCard';

// THEME constant
const THEME = {
  primary: '#E31C25',
  background: '#FFFFFF',
  text: '#1C1C1C',
  cardBackground: '#FFFFFF',
  icons: '#1C1C1C'
};

const HomeScreen = ({ navigation }) => {
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto/static/Roboto_Condensed-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto/static/Roboto_Condensed-Bold.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto/static/Roboto_Condensed-Medium.ttf'),
    'Roboto-SemiBold': require('../assets/fonts/Roboto/static/Roboto_Condensed-SemiBold.ttf'), // Make sure this font file exists
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [preBuiltProducts, setPreBuiltProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  // Destructure itemCount along with the other functions
  const { itemCount } = useCart();



  // Initial data loading
  useEffect(() => {
    const uniqueCategories = ['All', ...new Set(Item.map(item => item.category.name))];
    setCategories(uniqueCategories);
    
    setBestSellerProducts(Item.filter(p => parseFloat(p.rate) >= 4.5).slice(0, 8));
    setPreBuiltProducts(Item.filter(p => p.category.name && p.category.name.toLowerCase() === 'pre-built').slice(0, 8));
    setAllProducts(Item);
  }, []);

  // Para sa pag-search sa 'All Products' section
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filtered = Item.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setAllProducts(filtered);
    } else {
      setAllProducts(Item);
    }
  }, [searchQuery]);

  // Wait until the fonts are loaded before rendering the screen
  if (!fontsLoaded) {
    return null; // Or you can return a loading indicator here
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor='#FFFFFF'/>
      <View style={styles.header}>
        {/* Logo + Search */}
        <View style={styles.searchWrapper}>
          {/* Logo */}
          <Image 
            source={require('../assets/pcrexlogo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={22} color="#888" style={{ marginLeft: 8 }} />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search PC parts, brands..." 
              placeholderTextColor="#888" 
              value={searchQuery} 
              onChangeText={setSearchQuery} 
            />
          </View>
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

        {/* Account */}
        <TouchableOpacity>
          <Icon name="account-outline" size={28} color={THEME.icons} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      
      <ScrollView>
        <BannerSlider />
        <CategoryList categories={categories} navigation={navigation} />

        <ProductSection title="Pre Built PC" data={bestSellerProducts} navigation={navigation} theme={THEME} />
        <ProductSection title="Pre-built" data={preBuiltProducts} navigation={navigation} theme={THEME} />
        
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Products</Text>
            </View>
            <View style={styles.allProductsGrid}>
                {allProducts.map(item => (
                  <View key={item.id} style={styles.gridCardContainer}>
                    <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { product: item })} />
                  </View>
                ))}
            </View>
             {allProducts.length === 0 && (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No Products Found</Text>
                </View>
             )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Ginagamit ang THEME constant para sa styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, paddingBottom: Platform.OS === 'ios' ? 80 : 60},
  header: { backgroundColor: THEME.background, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, 
  elevation: 3, },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: THEME.cardBackground, 
    borderRadius: 8, 
    right: 10,
    height: 40,
    borderWidth: 1,            
    borderColor: THEME.primary,       
  },
  // Example of using the loaded font
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 14, color: THEME.text, fontFamily: 'Roboto-Regular' },
  headerIcon: { marginLeft: 12 },
  sectionContainer: { marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  // Example of using a bold font
  sectionTitle: { fontSize: 18, fontFamily: 'Roboto-Medium', color: THEME.text },
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
  allProductsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  gridCardContainer: { width: '50%' },
  noResultsContainer: { alignItems: 'center', justifyContent: 'center', padding: 20, minHeight: 150 },
  // Example of using a regular font
  noResultsText: { fontSize: 16, color: '#6c757d', fontFamily: 'Roboto-Regular' },
  logo: {
    width: 55,
    height: 55,
    right: 14
  },
});

export default HomeScreen;