import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { CartProvider } from './context/CartContext';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import 'react-native-gesture-handler';

// I-import ang iyong mga screen
import HomeScreen from "./Screen/HomeScreen";
import Cart from "./Screen/Cart";
import CategoryProducts from "./Screen/CategoryProducts";
import ProductDetails from "./Screen/ProducDetails";
import Products from "./Screen/Products";
import Account from "./Screen/Account";
import SignIn_SignUp from "./Screen/SignIn_SignUp";
import LoadingScreen from "./Screen/LoadingScreen";

// Gumawa ng stack at tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator para sa Home, Products, at MyAccount
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          
          left: 15,
          right: 15,
          height: 65,
       
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 15,
          overflow: 'hidden',
          borderTopWidth: 0,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 8,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#E31C25',
        tabBarInactiveTintColor: '#858585ff',
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? "home" : "home-outline"}
              size={focused ? size + 4 : size + 2}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={Products}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? "storefront" : "storefront-outline"}
              size={focused ? size + 4 : size + 2}
              color={color}
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? "account-circle" : "account-circle-outline"}
              size={focused ? size + 4 : size + 2}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const App = () => {
  return (
    // <CartProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoadingScreen">
        {/* Mga screen bago ang authentication */}
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{ headerShown: false }} />
         <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
         <Stack.Screen name="CategoryProducts" component={CategoryProducts} options={{ headerShown: false }} />
         <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn_SignUp" component={SignIn_SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
        <Stack.Screen name="Products" component={Products} options={{ headerShown: false }} />
        {/* Main Application Screens pagkatapos mag-login (nakapaloob sa Tab Navigator) */}
        <Stack.Screen
          name="HomeScreen"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
      // {/* </CartProvider> */}
  );
};

export default App;