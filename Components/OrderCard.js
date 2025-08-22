// =============================================================
// File: src/components/OrderCard.js
// Description: A centralized, reusable card for displaying orders.
//              It adapts its appearance and actions based on order status
//              and navigates to OrderDetailsScreen on press.
// =============================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Centralized status styling for app-wide consistency
export const statusStyles = {
    'To Pay': { color: '#FFA500', icon: 'wallet-outline' },
    'To Ship': { color: '#3498DB', icon: 'package-variant-closed' },
    'To Receive': { color: '#2ECC71', icon: 'truck-delivery-outline' },
    'To Review': { color: '#9B59B6', icon: 'star-half-full' },
    'Completed': { color: '#7F8C8D', icon: 'check-circle-outline' },
    'Cancelled': { color: '#E74C3C', icon: 'close-circle-outline' },
};

const OrderCard = ({ order, navigation, onPay, onCancel, onConfirmReceipt, onReview }) => {
    const firstItem = order.items?.[0];
    const statusInfo = statusStyles[order.status] || { color: '#000', icon: 'help-circle-outline' };

    // This function decides which buttons to show based on the order status
    const renderActionButtons = () => {
        switch (order.status) {
            case 'To Pay':
                return (
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={onCancel}>
                            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onPay}>
                            <Text style={[styles.buttonText, styles.primaryButtonText]}>
                                {order.paymentMethod === 'cod' ? 'Confirm Order' : 'Pay Now'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'To Receive':
                return (
                     <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onConfirmReceipt}>
                            <Text style={[styles.buttonText, styles.primaryButtonText]}>Order Received</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'To Review':
                return (
                     <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onReview}>
                            <Text style={[styles.buttonText, styles.primaryButtonText]}>Rate Product</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                // No actions for 'To Ship', 'Completed', or 'Cancelled' in the card footer
                return null;
        }
    };
    
    // Navigate to the new OrderDetailsScreen when the card is pressed
    const handleCardPress = () => {
        navigation.navigate('OrderDetails', { orderId: order.id });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handleCardPress} activeOpacity={0.85}>
            <View style={styles.cardHeader}>
                <View style={styles.statusContainer}>
                    <Icon name={statusInfo.icon} size={15} color={statusInfo.color} />
                    <Text style={[styles.orderStatus, { color: statusInfo.color }]}>{order.status}</Text>
                </View>
                <Text style={styles.orderDate}>
                    {new Date(order.orderDate).toLocaleDateString()}
                </Text>
            </View>
            
            <View style={styles.cardBody}>
                <Image source={{ uri: firstItem?.images?.[0] }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2}>{firstItem?.name}</Text>
                    {order.items.length > 1 && (
                        <Text style={styles.moreItemsText}>+ {order.items.length - 1} other item(s)</Text>
                    )}
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.orderTotalLabel}>Total:</Text>
                <Text style={styles.orderTotalValue}>₱{order.total.toLocaleString()}</Text>
            </View>
            
            {renderActionButtons()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 5, overflow: 'hidden' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
    statusContainer: { flexDirection: 'row', alignItems: 'center' },
    orderStatus: { fontSize: 13, fontWeight: 'bold', marginLeft: 6 },
    orderDate: { fontSize: 13, color: '#868E96' },
    cardBody: { flexDirection: 'row', padding: 14 },
    itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 14, backgroundColor: '#EAEAEA' },
    itemDetails: { flex: 1, justifyContent: 'center' },
    itemName: { fontSize: 16, fontWeight: '600', color: '#343A40', marginBottom: 4 },
    moreItemsText: { fontSize: 12, color: '#ADB5BD' },
    cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 14, paddingTop: 10 },
    orderTotalLabel: { fontSize: 14, color: '#495057' },
    orderTotalValue: { fontWeight: 'bold', fontSize: 18, marginLeft: 8, color: '#212529' },
    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#F1F3F5', padding: 10, backgroundColor: '#F8F9FA' },
    actionButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginLeft: 10 },
    primaryButton: { backgroundColor: '#EE2323' },
    secondaryButton: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DEE2E6' },
    buttonText: { fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
    primaryButtonText: { color: '#FFF' },
    secondaryButtonText: { color: '#495057' },
});

export default OrderCard;