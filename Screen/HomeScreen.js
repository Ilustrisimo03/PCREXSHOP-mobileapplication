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
import { useCart } from '../context/CartContext';
import { useFonts } from 'expo-font';

// Import data
import Item from '../data/Item.json';

// Import components
import BannerSlider from '../Components/BannerSlider';
import CategoryList from '../Components/CategoryList';
// REMOVED: import ProductSection from '../Components/ProductSection'; // We will use this only for generic sections if needed
import BestSellerSection from '../Components/BestSellerSection'; // NEW
import PreBuiltSection from '../Components/PreBuiltSection';     // NEW
import ProductCard from '../Components/ProductCard';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const THEME = {
  primary: '#E31C25',
  background: '#FFFFFF',
  text: '#1C1C1C',
  cardBackground: '#FFFFFF',
  icons: '#1C1C1C'
};

const HomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('../assets/fonts/Rubik/static/Rubik-Regular.ttf'),
    'Rubik-Bold': require('../assets/fonts/Rubik/static/Rubik-Bold.ttf'),
    'Rubik-Medium': require('../assets/fonts/Rubik/static/Rubik-Medium.ttf'),
    'Rubik-SemiBold': require('../assets/fonts/Rubik/static/Rubik-SemiBold.ttf'),
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [preBuiltProducts, setPreBuiltProducts] = useState([]);
  const [allProductsDisplay, setAllProductsDisplay] = useState([]); // Renamed to avoid confusion with original Item
  const { itemCount } = useCart();

  useEffect(() => {
    const processedItems = Item.map(item => ({
      ...item,
      category: item.category || { name: 'Unknown' }
    }));

    const uniqueCategories = [...new Set(processedItems.map(item => item.category.name))];
    setCategories(uniqueCategories);
    
    // Filter Best Seller based on 'isBestSeller' property (assuming you have this in your JSON)
    // If 'isBestSeller' is not in your JSON, you can use the rate >= 4.5 logic here as well.
    setBestSellerProducts(processedItems.filter(p => p.isBestSeller).slice(0, 8)); // Use your actual best seller logic
    
    setPreBuiltProducts(processedItems.filter(p => p.category.name && p.category.name.toLowerCase() === 'pre-built').slice(0, 8));
    
    setAllProductsDisplay(processedItems); // Initial load for "All Products"
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filtered = Item.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setAllProductsDisplay(filtered);
    } else {
      setAllProductsDisplay(Item); // Reset to all items when search is cleared
    }
  }, [searchQuery]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
      <View style={styles.searchWrapper}>
        <Image
          source={require('../assets/pcrexlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
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
      </View>

      {/* Cart Icon */}
      <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
        <View>
          <Icon name="cart-outline" size={24} color={THEME.icons} />
          {itemCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{itemCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Account Icon */}
      <TouchableOpacity onPress={() => navigation.navigate('Account')}>
        <Icon name="account-outline" size={26} color={THEME.icons} style={styles.headerIcon} />
      </TouchableOpacity>
    </View>
      
      <ScrollView>
        <BannerSlider />
        
        {/* categories sections */}
        <CategoryList categories={categories} navigation={navigation} />

        {/* bestSellerProducts sections */}
        <BestSellerSection data={bestSellerProducts} navigation={navigation} />

         {/* preBuiltProducts sections */}
        <PreBuiltSection data={preBuiltProducts} navigation={navigation} />
        
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Just For You</Text>
            </View>
            <View style={styles.allProductsGrid}>
                {allProductsDisplay.map(item => ( // Use allProductsDisplay here
                  <View key={item.id} style={styles.gridCardContainer}>
                    <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { product: item })} />
                  </View>
                ))}
            </View>
             {allProductsDisplay.length === 0 && (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No Products Found</Text>
                </View>
             )}
        </View>
      </ScrollView>
    </SafeAreaView>
  ); 
}; 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, paddingBottom: Platform.OS === 'ios' ? 80 : 60},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    width: '100%',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBackground,
    borderRadius: 15,
    height: 40,
    borderWidth: 1,
    borderColor: THEME.primary
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    
    color: THEME.text
  },
  badgeContainer: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: THEME.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: THEME.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerIcon: {
    marginLeft: 15,
  },
  sectionContainer: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Rubik-SemiBold',
    color: THEME.text,
  },
  allProductsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  gridCardContainer: { width: '50%' },
  noResultsContainer: { alignItems: 'center', justifyContent: 'center', padding: 20, minHeight: 150 },
  noResultsText: { fontSize: 16, color: '#6c757d', fontFamily: 'Rubik-Regular' },


  
});

export default HomeScreen;