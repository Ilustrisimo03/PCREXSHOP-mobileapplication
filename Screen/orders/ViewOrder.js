import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useOrders } from '../../context/OrderContext';

const statusStyles = {
    'To Pay': { color: '#FFA500', icon: 'wallet-outline' },
    'To Ship': { color: '#3498DB', icon: 'package-variant-closed' },
    'To Receive': { color: '#2ECC71', icon: 'truck-delivery-outline' },
    'To Review': { color: '#9B59B6', icon: 'star-half-full' },
    'Completed': { color: '#7F8C8D', icon: 'check-circle-outline' },
    'Cancelled': { color: '#E74C3C', icon: 'close-circle-outline' },
};

const OrderHistoryCard = ({ order }) => {
    const statusInfo = statusStyles[order.status] || { color: '#000', icon: 'help-circle-outline' };
    const firstItem = order.items?.[0];

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.statusContainer]}>
                     <Icon name={statusInfo.icon} size={15} color={statusInfo.color} />
                    <Text style={[styles.orderStatus, { color: statusInfo.color }]}>{order.status}</Text>
                </View>
                <Text style={styles.orderDate}>
                    {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </Text>
            </View>
            <View style={styles.cardBody}>
                <Image source={{ uri: firstItem?.images?.[0] }} style={styles.itemImage}/>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2}>{firstItem?.name}</Text>
                    {order.items.length > 1 && (
                        <Text style={styles.moreItemsText}>+ {order.items.length - 1} other item(s)</Text>
                    )}
                </View>
            </View>
            <View style={styles.cardFooter}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>₱{order.total.toLocaleString()}</Text>
            </View>
        </View>
    );
};

const ViewOrder = ({ navigation }) => {
    const { orders } = useOrders();
    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    }, [orders]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={26} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Purchase History</Text>
            </View>
            <FlatList
                data={sortedOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OrderHistoryCard order={item} />}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="receipt-text-outline" size={70} color="#CCC" />
                        <Text style={styles.emptyText}>You have no order history yet.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
    headerTitle: { fontSize: 22, fontWeight: '700', marginLeft: 16, color: '#212529' },
    listContainer: { padding: 12 },
    card: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingTop: 14, paddingBottom: 10 },
    statusContainer: { flexDirection: 'row', alignItems: 'center' },
    orderStatus: { fontSize: 14, fontWeight: 'bold', marginLeft: 6 },
    orderDate: { fontSize: 13, color: '#868E96' },
    cardBody: { flexDirection: 'row', padding: 14, borderTopWidth: 1, borderTopColor: '#F1F3F5' },
    itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 14, backgroundColor: '#EAEAEA' },
    itemDetails: { flex: 1, justifyContent: 'center' },
    itemName: { fontSize: 16, fontWeight: '600', color: '#343A40', marginBottom: 4 },
    moreItemsText: { fontSize: 12, color: '#ADB5BD' },
    cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: '#F1F3F5' },
    totalLabel: { fontSize: 14, color: '#495057' },
    totalValue: { fontWeight: 'bold', fontSize: 18, marginLeft: 8, color: '#EE2323' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
    emptyText: { marginTop: 20, fontSize: 17, color: '#ADB5BD' },
});

export default ViewOrder;