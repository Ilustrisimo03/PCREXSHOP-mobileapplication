// =============================================================
// File: src/context/OrderContext.js
// Description: Centralized user-side order state management.
// Key Changes:
// - All orders (incl. COD) now start as 'To Pay' for user confirmation.
// - Cancellation is strictly limited to the 'To Pay' status.
// =============================================================

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDERS_STORAGE_KEY = '@MyApp:orders_v2';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from storage on initial app mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const stored = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
        if (stored) setOrders(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load orders from storage.', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Persist orders to storage whenever they change
  useEffect(() => {
    if (isLoading) return;
    AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders)).catch((e) =>
      console.error('Failed to save orders to storage.', e)
    );
  }, [orders, isLoading]);

  /**
   * Creates a new order. All orders start with 'To Pay' status.
   * For COD, this serves as a confirmation step before processing.
   * @param {{items: any[], shippingAddress: object, paymentMethod: 'cod'|'gcash'|'card', total: number, subtotal: number, shippingFee: number}} orderData
   */
  const placeOrder = (orderData) => {
    const newOrder = {
      id: `order_${Date.now()}`,
      ...orderData,
      status: 'To Pay', // CRITICAL: All orders start here.
      orderDate: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  /**
   * Handles user-driven status updates.
   * 'To Pay' -> 'To Ship' (Payment/Confirmation)
   * 'To Receive' -> 'To Review' (Receipt Confirmation)
   * 'To Review' -> 'Completed' (Review Submitted)
   */
  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
  };

  /**
   * Allows cancellation ONLY if the order is still in the 'To Pay' status.
   * This prevents users from cancelling an order that is already being processed.
   * Returns true if cancellation was successful, false otherwise.
   */
  const cancelOrder = (orderId) => {
    let wasCancelled = false;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && o.status === 'To Pay') {
          wasCancelled = true;
          return { ...o, status: 'Cancelled' };
        }
        return o;
      })
    );
    return wasCancelled;
  };

  const value = useMemo(
    () => ({
      orders,
      isLoading,
      placeOrder,
      updateOrderStatus,
      cancelOrder,
    }),
    [orders, isLoading]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return ctx;
};