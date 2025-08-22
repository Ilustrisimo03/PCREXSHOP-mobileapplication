// context/CartContext.js

import React, { createContext, useState, useContext, useMemo } from 'react';
import { Alert } from 'react-native';

// 1. Create the Context
const CartContext = createContext();

// 2. Create the Provider Component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    /**
     * Adds a single product to the cart.
     * Checks if the item already exists before adding.
     * @param {Object} product - The product object to add.
     */
    const addToCart = (product) => {
        // Check if the item is already in the cart
        const isItemInCart = cartItems.find(item => item.id === product.id);

        if (isItemInCart) {
            Alert.alert("Already in Cart", `${product.name} is already in your cart.`);
        } else {
            setCartItems(prevItems => [...prevItems, product]);
            Alert.alert("Item Added", `${product.name} has been added to your cart.`);
        }
    };

    /**
     * Replaces the current cart with a new set of items from the PC Builder.
     * @param {Array} items - An array of product objects to set as the new cart.
     */
    const addBuildToCart = (items) => {
        setCartItems(items.filter(item => item)); // Ensure no null/undefined items
    };

    /**
     * Sets the cart to a single item for immediate purchase and navigates to the cart.
     * @param {Object} product - The product object to buy now.
     */
    const buyNow = (product) => {
        setCartItems([product]); // Set the cart to only contain this one item
        // Note: Navigation should be handled in the component after calling this.
    };

    /**
     * Removes a specific item from the cart by its ID.
     * @param {String|Number} itemId - The unique ID of the item to remove.
     */
    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    /**
     * Clears all items from the cart instantly without confirmation.
     */
    const clearCart = () => {
        setCartItems([]);
    };

    // Calculate the total price whenever the cartItems array changes.
    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, product) => total + parseFloat(product.price), 0);
    }, [cartItems]);

    // The value object contains all the state and functions for components to use.
    const value = {
        cartItems,
        addToCart,
        addBuildToCart,
        buyNow,
        removeFromCart,
        clearCart,
        totalPrice,
        itemCount: cartItems.length
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// 3. Create a Custom Hook for easy context access
export const useCart = () => {
    return useContext(CartContext);
};