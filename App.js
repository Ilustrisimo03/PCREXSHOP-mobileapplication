import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import { CartProvider } from './context/CartContext';
import { StatusBar } from "react-native"; 

import { CartProvider } from './context/CartContext'; // <-- Import CartProvider
import { OrderProvider } from './context/OrderContext'; // <-- I-import ang OrderProvider
import { UserProvider } from './context/UserContext'; // <-- I-import ang OrderProvider
import { ShippingProvider } from './context/ShippingContext'; // <-- I-import ang OrderProvider

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import 'react-native-gesture-handler';

// I-import ang iyong mga screen
import HomeScreen from "./Screen/HomeScreen";
import Cart from "./Screen/Cart";
import CategoryProducts from "./Screen/CategoryProducts";
import ProductDetails from "./Screen/ProductDetails";
import Checkout from "./Screen/Checkout";
import OrderSuccess from "./Screen/OrderSuccess";
import OrderDetails from "./Screen/OrderDetails";

import SearchProduct from "./Components/SearchProduct";

import Products from "./Screen/Products";
import Builder from "./Screen/Builder";
import Account from "./Screen/Account";
import SignIn_SignUp from "./Screen/SignIn_SignUp";

import EditProfile from "./Screen/EditProfile";
import ShippingAddress from "./Screen/ShippingAddress";

import ViewOrder from "./Screen/ViewOrder";
import ToPay from "./Screen/ToPay";
import ToShip from "./Screen/ToShip";
import ToReceive from "./Screen/ToReceive";
import ToReview from "./Screen/ToReview";
// import Editprofile from "./Screen/Editprofile";
// import Shippingaddress from "./Screen/Shippingaddress";

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
          marginLeft: 16,
          marginRight: 16,
          height: 65,
          borderRadius: 20,
          bottom: 20,
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
        tabBarActiveTintColor: '#074ec2',
        tabBarInactiveTintColor: '#7c7c7c',
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
        name="Build A PC"
        component={Builder}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? "desktop-mac" : "desktop-mac"}
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
   <SafeAreaProvider>
    
     <StatusBar hidden />

  <SafeAreaView style={{ flex: 1, backgroundColor: "#074ec2" }}>
    <UserProvider>
    <CartProvider>
      <OrderProvider>
        <ShippingProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignIn_SignUp" >
           
            <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
            <Stack.Screen name="CategoryProducts" component={CategoryProducts} options={{ headerShown: false }} />
            <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccess} options={{ headerShown: false }} />

            <Stack.Screen name="SearchProduct" component={SearchProduct} options={{ headerShown: false }} />

            <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: false}} />
            <Stack.Screen name="SignIn_SignUp" component={SignIn_SignUp} options={{ headerShown: false }} />

             <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
            <Stack.Screen name="ShippingAddress" component={ShippingAddress} options={{ headerShown: false }} />
            

            {/* <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
            <Stack.Screen name="Products" component={Products} options={{ headerShown: false }} />
            <Stack.Screen name="Builder" component={Builder} options={{ headerShown: false }} /> */}

            <Stack.Screen name="ViewOrder" component={ViewOrder} options={{ headerShown: false }} />
            <Stack.Screen name="ToPay" component={ToPay} options={{ headerShown: false }} />
            <Stack.Screen name="ToShip" component={ToShip} options={{ headerShown: false }} />
            <Stack.Screen name="ToReceive" component={ToReceive} options={{ headerShown: false }} />
            <Stack.Screen name="ToReview" component={ToReview} options={{ headerShown: false }} />
            {/* Main Application Screens pagkatapos mag-login (nakapaloob sa Tab Navigator) */}
            <Stack.Screen
              name="HomeScreen"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
            
        </NavigationContainer>
        </ShippingProvider>
      </OrderProvider>
    </CartProvider>
 </UserProvider>
    </SafeAreaView>
    </SafeAreaProvider> 
  );
};

export default App;