import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Image,
  Dimensions
} from 'react-native';
import ProductCard from '../Components/ProductCard';
import Item from '../data/Item.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// DATA PARA SA IMAGE SLIDER
const BANNERS = [
  { id: '1', image: require('../assets/images/promotional1.png') },
  { id: '2', image: require('../assets/images/promotional2.png') },
  { id: '3', image: require('../assets/images/promotional3.png') },
  { id: '4', image: require('../assets/images/promotional4.png') },
  { id: '5', image: require('../assets/images/promotional3.png') },
];

const { width } = Dimensions.get('window');

// THEME
const THEME = {
  primary: '#E31C25',
  background: '#FFFFFF',
  text: '#1C1C1C',
  cardBackground: '#FFFFFF'
};

// --- SOLUSYON SA BUG: Ginamit ang React.memo ---
// Ang component na ito ay hindi na magre-render ulit kung hindi nagbabago ang props nito.
const ProductSection = React.memo(({ title, data, navigation }) => {
  if (!data || data.length === 0) return null;
  
  const handleMorePress = () => {
    // Ang 'Best seller' at 'Pre-built' ay special cases na ipapasa natin
    const categoryNameToPass = title.toLowerCase() === 'best seller' ? 'Best seller' : title;
    navigation.navigate('CategoryProducts', { categoryName: categoryNameToPass });
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={handleMorePress}>
          <Text style={styles.moreText}>more</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={{ width: 160 }}>
            <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { product: item })} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
});

const Home = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  
  // State para lang sa product lists na ipapakita sa Home
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [preBuiltProducts, setPreBuiltProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // State at Refs para sa Slider
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerRef = useRef(null);

  // Initial data loading
  useEffect(() => {
    const uniqueCategories = ['All', ...new Set(Item.map(item => item.category.name))];
    setCategories(uniqueCategories);

    // Initial load, hindi na ito magbabago maliban kung mag-search
    setBestSellerProducts(Item.filter(p => parseFloat(p.rate) >= 4.5).slice(0, 8));
    setPreBuiltProducts(Item.filter(p => p.category.name && p.category.name.toLowerCase() === 'pre-built').slice(0, 8));
    setAllProducts(Item);
  }, []);

  // Para lang sa pag-search sa 'All Products' section
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const filtered = Item.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setAllProducts(filtered);
    } else {
      setAllProducts(Item);
    }
  }, [searchQuery]);

  // Logic para sa Slider Pagination
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveBannerIndex(viewableItems[0].index || 0);
    }
  }).current;
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Auto-scroll para sa Slider
  useEffect(() => {
    const interval = setInterval(() => {
        if (bannerRef.current) {
            const nextIndex = (activeBannerIndex + 1) % BANNERS.length;
            bannerRef.current.scrollToIndex({ index: nextIndex, animated: true });
        }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeBannerIndex]);

  const renderBannerItem = ({ item }) => (
    <View style={styles.bannerContainer}>
      <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
      
      <View style={styles.header}>
        {/* Header content... */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={22} color="#888" style={{marginLeft: 8}} />
          <TextInput style={styles.searchInput} placeholder="Search PC parts, brands..." placeholderTextColor="#888" value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Icon name="cart-outline" size={28} color={THEME.cardBackground} style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
            <Icon name="account-outline" size={28} color={THEME.cardBackground} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {/* Image Slider */}
        <View style={styles.sliderWrapper}>
          <FlatList ref={bannerRef} data={BANNERS} renderItem={renderBannerItem} keyExtractor={item => item.id} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig} />
          <View style={styles.pagination}>
            {BANNERS.map((_, index) => (<View key={index} style={[styles.dot, activeBannerIndex === index ? styles.dotActive : null ]} />))}
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.categorySectionContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((cat, index) => (
                <TouchableOpacity key={index} style={styles.categoryButton} onPress={() => navigation.navigate('CategoryProducts', { categoryName: cat })}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </TouchableOpacity>
            ))}
            </ScrollView>
        </View>

        <ProductSection title="Best seller" data={bestSellerProducts} navigation={navigation} />
        <ProductSection title="Pre-built" data={preBuiltProducts} navigation={navigation} />
        
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Product</Text>
            </View>
            <View style={styles.allProductsGrid}>
                {allProducts.map(item => (<View key={item.id} style={styles.gridCardContainer}><ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { product: item })} /></View>))}
            </View>
             {allProducts.length === 0 && (<View style={styles.noResultsContainer}><Text style={styles.noResultsText}>No Products Found</Text></View>)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles (walang binago dito, kopyahin lang)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  header: { backgroundColor: THEME.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.cardBackground, borderRadius: 8, height: 40 },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 14, color: THEME.text },
  headerIcon: { marginLeft: 12 },
  sliderWrapper: { height: 180, marginTop: 16 },
  bannerContainer: { width: width, height: 180, paddingHorizontal: 16 },
  bannerImage: { width: '100%', height: '100%', borderRadius: 12 },
  pagination: { position: 'absolute', bottom: 15, flexDirection: 'row', alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.5)', marginHorizontal: 4 },
  dotActive: { backgroundColor: 'rgba(255, 255, 255, 0.9)', width: 20 },
  categorySectionContainer: { marginVertical: 16 },
  categoryScroll: { paddingHorizontal: 16 },
  categoryButton: { backgroundColor: '#F3F4F6', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20, marginRight: 10 },
  categoryText: { color: THEME.text, fontWeight: '500' },
  sectionContainer: { marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: THEME.text },
  moreText: { fontSize: 13, color: '#888' },
  allProductsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  gridCardContainer: { width: '50%' },
  noResultsContainer: { alignItems: 'center', justifyContent: 'center', padding: 20, minHeight: 150 },
  noResultsText: { fontSize: 16, color: '#6c757d' },
});

export default Home;