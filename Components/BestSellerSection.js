// BestSellerSection.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCard from './ProductCard';

const { width } = Dimensions.get('window');
const THEME = {
  primary: '#E31C25',
  secondary: '#FFD700', // Gold color for Best Seller icon
  text: '#1C1C1C',
  background: '#FFFFFF',
  accent: '#34C759',
  cardBackground: '#FFFFFF',
  shadowColor: '#000',
};

const BestSellerSection = ({ title, data, navigation }) => {
  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('../assets/fonts/Rubik/static/Rubik-Regular.ttf'),
    'Rubik-Bold': require('../assets/fonts/Rubik/static/Rubik-Bold.ttf'),
    'Rubik-Medium': require('../assets/fonts/Rubik/static/Rubik-Medium.ttf'),
    'Rubik-SemiBold': require('../assets/fonts/Rubik/static/Rubik-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  if (!data || data.length === 0) return null;

  const handleMorePress = () => {
    navigation.navigate('CategoryProducts', { categoryName: 'Best Seller' });
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.iconBadge}>
            <Icon name="crown" size={20} color={THEME.secondary} />
          </View>
          <Text style={styles.sectionTitle}>Best Seller</Text>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={handleMorePress}>
          <Text style={styles.moreText}>View All</Text>
          <Icon name="arrow-right" size={18} color={THEME.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <View style={[
            styles.productCardWrapper,
            index === 0 && styles.firstCard,
            index === data.length - 1 && styles.lastCard
          ]}>
            <View style={styles.bestSellerBadge}>
              <Text style={styles.bestSellerRank}>#{index + 1}</Text>
            </View>
            <ProductCard 
              product={item} 
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
              showBestSellerBadge={false} // Ensure ProductCard itself doesn't show another badge
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={width * 0.68 + 16}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 0,
    paddingVertical: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, 
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.25)', // Slightly more opaque gold
    padding: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Rubik-Medium',
    color: THEME.text,
    letterSpacing: -0.4,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(227, 28, 37, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  moreText: {
    fontSize: 14,
    fontFamily: 'Rubik-SemiBold',
    color: THEME.primary,
  },
  listContent: {
    paddingHorizontal: 12, // Increased horizontal padding for list
    gap: 0, // Increased gap between product cards
  },
  productCardWrapper: {
    width: width * 0.5, 
  },
  firstCard: {
    marginLeft: 0,
  },
  lastCard: {
    marginRight: 0,
  },
  bestSellerBadge: {
    position: 'absolute',
    top: 10, // Slightly more padding
    left: 10, // Slightly more padding
    backgroundColor: '#FFBE0B', // A vibrant gold color
    borderRadius: 15, // More rounded badge
    paddingHorizontal: 10, // Increased padding
    paddingVertical: 5, // Increased padding
    zIndex: 10,
    shadowColor: THEME.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, // More prominent shadow
    shadowRadius: 4,
    elevation: 4,
  },
  bestSellerRank: {
    color: '#FFFFFF',
    fontSize: 13, // Slightly larger font
    fontFamily: 'Rubik-Bold',
  },
});

export default BestSellerSection;