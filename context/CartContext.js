// context/CartContext.js

import React, { createContext, useState, useContext, useMemo } from 'react';

// 1. Create the Context
const CartContext = createContext();

// 2. Create the Provider Component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    /**
     * Adds a product to the cart or increments its quantity if it already exists.
     * Respects the item's stock limit.
     * @param {Object} product - The product object to add.
     */
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            // If item is already in the cart
            if (existingItem) {
                // Check against stock before increasing quantity
                if (existingItem.quantity < product.stock) {
                    return prevItems.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    // Optionally, provide feedback that stock limit is reached.
                    // This is handled in the UI for better user experience.
                    return prevItems; // Do not add if stock limit is met
                }
            }
            // If item is new, add it with quantity 1
            else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };
    
    /**
     * Increases the quantity of a specific item in the cart by one.
     * @param {String|Number} itemId - The ID of the item to increase.
     */
    const increaseQuantity = (itemId) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === itemId && item.quantity < item.stock) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                // Optionally, alert the user if they hit the stock limit.
                return item;
            })
        );
    };

    /**
     * Decreases the quantity of a specific item in the cart by one.
     * If quantity becomes 0, it should be removed (handled by the remove button in UI).
     * @param {String|Number} itemId - The ID of the item to decrease.
     */
    const decreaseQuantity = (itemId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };


    /**
     * Removes a specific item from the cart by its ID.
     * @param {String|Number} itemId - The unique ID of the item to remove.
     */
    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    /**
     * Clears all items from the cart.
     */
    const clearCart = () => {
        setCartItems([]);
    };

    // Calculate total price based on price * quantity
    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    }, [cartItems]);

    // Calculate total number of items (units) in the cart
    const itemCount = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        totalPrice,
        itemCount,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// 3. Create a Custom Hook
export const useCart = () => {
    return useContext(CartContext);
};