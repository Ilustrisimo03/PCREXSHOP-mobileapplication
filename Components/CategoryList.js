import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'; // Import the useFonts hook
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the Icon component

// Define a mapping from category names to icon names
const categoryIcons = {
  'Components': 'memory',
  'Peripherals': 'keyboard-outline',
  'Furniture': 'desk',
  'Pre-Built': 'desktop-tower-monitor'
};

const CategoryList = ({ categories, navigation }) => {
   // Load custom fonts
      const [fontsLoaded] = useFonts({
        'Rubik-Regular': require('../assets/fonts/Rubik/static/Rubik-Regular.ttf'),
        'Rubik-Bold': require('../assets/fonts/Rubik/static/Rubik-Bold.ttf'),
        'Rubik-Medium': require('../assets/fonts/Rubik/static/Rubik-Medium.ttf'),
        'Rubik-SemiBold': require('../assets/fonts/Rubik/static/Rubik-SemiBold.ttf'), // Make sure this font file exists
      });

    // Wait until the fonts are loaded before rendering the screen
  if (!fontsLoaded) {
    return null; // Or you can return a loading indicator here
  }
  return (
    <View style={styles.categorySectionContainer}>
      <Text style={styles.CategoriesText}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryButton}
            onPress={() => navigation.navigate('CategoryProducts', { categoryName: cat })}
          >
         
            <View style={styles.buttonContent}>
              
              
              <Icon name={categoryIcons[cat] || 'help-circle'} size={20} color="#FFFFFF" />

             
              <Text style={styles.categoryText}>{cat}</Text>

            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categorySectionContainer: { marginVertical: 16 },
  CategoriesText:{ fontSize: 18, fontFamily: 'Rubik-Medium', paddingHorizontal: 16, marginBottom: 12},
  categoryScroll: { paddingHorizontal: 16 },
  categoryButton: {
    backgroundColor: '#E31C25',
    borderRadius: 15,
    marginRight: 10,
    paddingHorizontal: 15,
    height: 50, // Pwedeng i-adjust ang height kung kailangan
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buttonContent: {
    flexDirection: 'row', // Dinagdag para maging horizontal ang alignment
    alignItems: 'center'
  },
  categoryText: {
    color: '#FFFFFF',
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
    marginLeft: 5
  },
});

export default CategoryList;