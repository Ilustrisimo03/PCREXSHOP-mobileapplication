import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    SafeAreaView, 
    TouchableOpacity, 
    StatusBar,
    TextInput
} from 'react-native';
import ProductCard from '../Components/ProductCard'; // Ang component na ito ay dapat ayusin
import Item from '../data/Item.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// THEME (Consistent sa HomeScreen)
const THEME = {
  primary: '#E31C25',
  background: '#FFFFFF',
  text: '#1C1C1C',
  cardBackground: '#FFFFFF'
};

const CategoryProducts = ({ route, navigation }) => {
  const { categoryName } = route.params;
  
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let baseProducts = [];
    
    if (categoryName.toLowerCase() === 'all') {
      baseProducts = Item;
    } else if (categoryName.toLowerCase() === 'pre built pc') {
      baseProducts = Item.filter(p => parseFloat(p.rate) >= 4.5);
    } else {
      baseProducts = Item.filter(p => p.category && p.category.name.toLowerCase() === categoryName.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
      const filteredProducts = baseProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filteredProducts);
    } else {
      setProducts(baseProducts);
    }
  }, [categoryName, searchQuery]);

  // Dito, ipinapasa natin ang buong 'item' sa ProductCard at ProductDetails.
  // DAPAT mong siguraduhin na ang 'ProductCard.js' ay gumagamit na rin ng 'item.images[0]'.
  const renderProduct = ({ item }) => (
    <View style={styles.gridCardContainer}>
        <ProductCard 
            product={item} 
            onPress={() => navigation.navigate('ProductDetails', { product: item })} 
        />
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
                <Icon name="magnify" size={22} color="#888" style={{marginLeft: 8}} />
                <TextInput 
                    style={styles.searchInput} 
                    placeholder={`Search in ${categoryName}...`}
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

        <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 10 }}
            ListEmptyComponent={
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                      {searchQuery ? 'No Results Found' : 'No Products in this Category'}
                    </Text>
                </View>
            }
        />
    </SafeAreaView>
  );
};

// ... (Walang pagbabago sa Styles)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
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
        color: THEME.text 
    },
    headerIcon: { 
        marginLeft: 4
    },
    gridCardContainer: { 
        width: '50%', 
        padding: 4 
    },
    noResultsContainer: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingTop: 50, 
        flex: 1 
    },
    noResultsText: { 
        fontSize: 16, 
        color: '#6c757d' 
    },
});

export default CategoryProducts;