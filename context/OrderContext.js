// =============================================================
// File: src/context/OrderContext.js (UPDATED)
// =============================================================

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDERS_STORAGE_KEY = '@MyApp:orders_v2';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from storage
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

  // Persist orders to storage
  useEffect(() => {
    if (isLoading) return;
    AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders)).catch((e) =>
      console.error('Failed to save orders to storage.', e)
    );
  }, [orders, isLoading]);

  // ===== PLACE ORDER =====
  const placeOrder = (orderData) => {
    const newOrder = {
      id: `order_${Date.now()}`,
      ...orderData,
      // ✅ If paymentMethod = Gcash → diretso "To Ship"
      status: orderData.paymentMethod === 'gcash' ? 'To Ship' : 'To Pay',
      orderDate: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
  };

  /**
   * =======================================================
   * === CANCELLATION LOGIC ===
   * =======================================================
   * Allows cancellation if the order is in 'To Pay' OR 'To Ship'
   */
  const cancelOrder = (orderId) => {
    let wasCancelled = false;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && (o.status === 'To Pay' || o.status === 'To Ship')) {
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
