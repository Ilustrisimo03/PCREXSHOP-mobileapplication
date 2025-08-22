import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useOrders } from '../../context/OrderContext';

// --- IMPROVED OrderCard Component ---
const OrderCard = ({ order, onPay, onCancel }) => {
    const firstItem = order.items?.[0];
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Order ID: {order.id}</Text>
                <Text style={styles.orderStatus}>{order.status}</Text>
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
            <View style={styles.actionRow}>
                 <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={onCancel}>
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel Order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.payButton]} onPress={onPay}>
                    <Text style={[styles.buttonText, styles.payButtonText]}>Pay Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const ToPay = ({ navigation }) => {
    const { orders, updateOrderStatus, cancelOrder } = useOrders();

    const toPayOrders = useMemo(() => orders.filter(o => o.status === 'To Pay'), [orders]);

    const handlePayment = (orderId) => {
        Alert.alert(
            "Confirm Payment",
            "This will simulate a successful payment and move your order to 'To Ship'. Continue?",
            [
                { text: "Cancel" },
                { text: "Yes, Pay Now", onPress: () => updateOrderStatus(orderId, 'To Ship') }
            ]
        );
    };
    
    const handleCancelOrder = (orderId) => {
        Alert.alert("Cancel Order", "Are you sure you want to cancel this order?",
            [{ text: "No" }, { text: "Yes, Cancel", onPress: () => cancelOrder(orderId), style: 'destructive' }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={26} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>For Payment</Text>
            </View>

            <FlatList
                data={toPayOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        onPay={() => handlePayment(item.id)}
                        onCancel={() => handleCancelOrder(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="wallet-outline" size={70} color="#CCC" />
                        <Text style={styles.emptyText}>You have no orders to pay for.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

// --- IMPROVED Styles ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
    headerTitle: { fontSize: 22, fontWeight: '700', marginLeft: 16, color: '#212529' },
    listContainer: { padding: 12 },
    card: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 5, overflow: 'hidden' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
    orderId: { fontSize: 13, color: '#868E96' },
    orderStatus: { fontSize: 13, fontWeight: 'bold', color: '#FFA500' },
    cardBody: { flexDirection: 'row', padding: 14 },
    itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 14, backgroundColor: '#EAEAEA' },
    itemDetails: { flex: 1, justifyContent: 'center' },
    itemName: { fontSize: 16, fontWeight: '600', color: '#343A40', marginBottom: 4 },
    moreItemsText: { fontSize: 12, color: '#ADB5BD' },
    cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 14 },
    orderTotalLabel: { fontSize: 14, color: '#495057' },
    orderTotalValue: { fontWeight: 'bold', fontSize: 18, marginLeft: 8, color: '#212529' },
    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#F1F3F5', padding: 10 },
    actionButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginLeft: 10 },
    cancelButton: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#DEE2E6' },
    payButton: { backgroundColor: '#EE2323' },
    buttonText: { fontWeight: 'bold', fontSize: 14 },
    cancelButtonText: { color: '#495057' },
    payButtonText: { color: '#FFF' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
    emptyText: { marginTop: 20, fontSize: 17, color: '#ADB5BD' },
});

export default ToPay;