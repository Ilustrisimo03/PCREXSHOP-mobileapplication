import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font'; // Import the useFonts hook

const CategoryList = ({ categories, navigation }) => {
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
  return (
    <View style={styles.categorySectionContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {categories.map((cat, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.categoryButton} 
            onPress={() => navigation.navigate('CategoryProducts', { categoryName: cat })}
          >
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categorySectionContainer: { marginVertical: 16 },
  categoryScroll: { paddingHorizontal: 16 },
  categoryButton: { backgroundColor: '#E31C25', paddingVertical: 8, paddingHorizontal: 29, borderRadius: 10, marginRight: 10, },
  categoryText: { color: '#FFFFFF', fontFamily: 'Roboto-SemiBold', fontSize: 15},
});

export default CategoryList;