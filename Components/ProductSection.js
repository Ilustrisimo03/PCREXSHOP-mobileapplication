import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'; // Import the useFonts hook
import ProductCard from './ProductCard';

// Binago: Tumatanggap na ng 'theme' prop
const ProductSection = ({ title, data, navigation, theme }) => {

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



  if (!data || data.length === 0) return null;

  const handleMorePress = () => {
    const categoryNameToPass = title.toLowerCase() === 'pre-built' ? 'pre-built' : title;
    navigation.navigate('CategoryProducts', { categoryName: categoryNameToPass });
  };

  // Gumamit ng 'theme' prop para sa kulay
  const styles = StyleSheet.create({
    sectionContainer: { marginBottom: 8 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontFamily: 'Roboto-Medium', color: theme.text }, // Gumagamit ng theme.text
    moreText: { fontSize: 13, fontFamily: 'Roboto-SemiBold', color: '#888' },
  });

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
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </View>
  );
};

export default React.memo(ProductSection);