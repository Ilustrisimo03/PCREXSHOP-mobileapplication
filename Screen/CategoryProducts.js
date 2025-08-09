import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import ProductCard from '../Components/ProductCard';
import Item from '../data/Item.json'; // Import ang data
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// THEME
const THEME = {
  primary: '#EE2323',
  background: '#FFFFFF',
  text: '#1C1C1C',
};

const CategoryProducts = ({ route, navigation }) => {
  const { categoryName } = route.params;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let filteredProducts = [];
    if (categoryName.toLowerCase() === 'all') {
      filteredProducts = Item;
    } else if (categoryName.toLowerCase() === 'best seller') {
      // Mag-filter base sa rating para sa 'Best seller'
      filteredProducts = Item.filter(p => parseFloat(p.rate) >= 4.5);
    } else {
      // Mag-filter base sa category name
      filteredProducts = Item.filter(p => p.category && p.category.name.toLowerCase() === categoryName.toLowerCase());
    }
    setProducts(filteredProducts);
  }, [categoryName]);

  const renderProduct = ({ item }) => (
    <View style={styles.gridCardContainer}>
        <ProductCard product={item} onPress={() => navigation.navigate('ProductDetails', { product: item })} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
        {/* Custom Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={28} color={THEME.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{categoryName}</Text>
            {/* Isang spacer para ma-gitna ang title */}
            <View style={{ width: 28 }} /> 
        </View>

        <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            ListEmptyComponent={
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No Products Found in this Category</Text>
                </View>
            }
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EAEAEA', marginBottom: 10 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: THEME.text },
    gridCardContainer: { width: '50%', padding: 4 }, // Halos kapareho ng sa Home.js
    noResultsContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 50, flex: 1 },
    noResultsText: { fontSize: 16, color: '#6c757d' },
});

export default CategoryProducts;