import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const CategoryList = ({ categories, navigation }) => {
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
  categoryButton: { backgroundColor: '#444', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 10, marginRight: 10 },
  categoryText: { color: '#FFFFFF', fontWeight: '500' },
});

export default CategoryList;