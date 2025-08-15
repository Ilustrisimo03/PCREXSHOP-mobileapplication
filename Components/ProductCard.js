import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated, // <-- Mahalaga para sa animation
  Platform // <-- Para sa pag-check ng OS (optional but good practice)
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font'; // Import the useFonts hook

const THEME = {
  COLORS: {
    primary: '#E31C25',
    text: '#1C1C1C',
    background: '#FAF5F1',
    card: '#FFFFFF',
    placeholder: '#F0F0F0', // Kulay para sa image background habang naglo-load
  },
};

// Helper function para sa presyo
const formatPrice = (price) => {

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


  const priceNumber = parseFloat(price);
  if (isNaN(priceNumber)) {
    return '₱--.--'; // Fallback kung sakaling hindi valid ang presyo
  }
  return `₱${priceNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const ProductCard = ({ product, onPress }) => {
  // Ginagamit ang useRef para sa animation value para hindi ito mag-reset sa bawat render
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sisimulan ang animation kapag lumabas na ang component
    Animated.timing(fadeAnim, {
      toValue: 1, // Target value (100% opacity)
      duration: 600, // Bilis ng animation in milliseconds
      useNativeDriver: true, // Gumagamit ng native thread para mas smooth ang performance
    }).start();
  }, [fadeAnim]);

  return (
    // Ang Animated.View ang container na may animation
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim }]}>
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.imageContainer}>
          <Animated.Image 
            source={{ uri: product.images[0] }} 
            style={styles.image}
            resizeMode='cover' // Pinalitan para mas mapuno ang space
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
           {/* Rating */}
                      <View style={styles.infoBox}>
                          <Icon name="star" size={12} color="#FFC700" />
                          <Text style={styles.infoText}>{product.rate} Stars</Text>
                      </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Ang 'wrapper' ang may hawak ng margin at animation
  wrapper: {
    flex: 1,
    margin: 8,
  },
  // Ang 'container' ang may hawak ng itsura ng card
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.card,
    borderRadius: 12, // Bahagyang mas bilugan
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
	    height: 2, // Bahagyang mas malaki ang anino
    },
    shadowOpacity: 0.1, // Mas subtle na anino
    shadowRadius: 1,
    // Ang elevation ay para sa Android
    elevation: Platform.OS === 'android' ? 1 : 0, 
  },
  imageContainer: {
    width: '100%',
    height: 140, // Bahagyang binago ang taas
    backgroundColor: THEME.COLORS.placeholder,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 12, // Bahagyang mas malaki
  },
  name: {
    color: THEME.COLORS.text,
    fontSize: 14,
    // Ang font family ay dapat naka-setup sa buong app. Kung wala pa, safe na alisin muna ito.
    // fontFamily: 'Poppins-SemiBold', 
   fontFamily: 'Roboto-Medium',
    height: 40, 
    lineHeight: 18, // Para mas maayos ang itsura ng multi-line text
  },
  price: {
    color: THEME.COLORS.primary,
    fontSize: 16,
    // fontFamily: 'Poppins-Bold',
   fontFamily: 'Roboto-Medium',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'Roboto-Regular',
  },
});

export default ProductCard;