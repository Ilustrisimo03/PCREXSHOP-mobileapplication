import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import data
import Item from '../data/Item.json';

// Import ng mga bagong components
import BannerSlider from '../Components/BannerSlider';
import CategoryList from '../Components/CategoryList';
import ProductSection from '../Components/ProductSection';
import ProductCard from '../Components/ProductCard';

// THEME constant na nandito lang
const THEME = {
  primary: '#E31C25',
  background: '#FFFFFF',
  text: '#1C1C1C',
  cardBackground: '#FFFFFF'
};

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [preBuiltProducts, setPreBuiltProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Initial data loading
  useEffect(() => {
    const uniqueCategories = ['All', ...new Set(Item.map(item => item.category.name))];
    setCategories(uniqueCategories);
    
    // Binago ang 'Pre-built' sa 'Best Seller' para sa unang section
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
      
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={22} color="#888" style={{marginLeft: 8}} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search PC parts, brands..." 
            placeholderTextColor="#888" 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Icon name="cart-outline" size={28} color={THEME.cardBackground} style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
            <Icon name="account-outline" size={28} color={THEME.cardBackground} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        <BannerSlider />
        <CategoryList categories={categories} navigation={navigation} />

        {/* Ipinapasa ang 'theme' prop */}
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
  container: { flex: 1, backgroundColor: THEME.background },
  header: { backgroundColor: THEME.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.cardBackground, borderRadius: 8, height: 40 },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 14, color: THEME.text },
  headerIcon: { marginLeft: 12 },
  sectionContainer: { marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: THEME.text },
  allProductsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  gridCardContainer: { width: '50%' },
  noResultsContainer: { alignItems: 'center', justifyContent: 'center', padding: 20, minHeight: 150 },
  noResultsText: { fontSize: 16, color: '#6c757d' },
});

export default HomeScreen;