import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useOrders } from '../../context/OrderContext';
const OrderCard = ({ order, onReview }) => {
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
<TouchableOpacity style={styles.actionButton} onPress={onReview}>
<Text style={styles.buttonText}>Rate Product</Text>
</TouchableOpacity>
</View>
</View>
);
};
const ToReview = ({ navigation }) => {
const { orders, updateOrderStatus } = useOrders();

const toReviewOrders = useMemo(() => orders.filter(order => order.status === 'To Review'), [orders]);

const handleReviewOrder = (orderId) => {
    Alert.alert(
        "Rate Product",
        "This will mark the order as 'Completed'. A real app would open a detailed review screen.",
        [
            { text: "Later", style: "cancel" },
            { text: "Mark as Completed", onPress: () => updateOrderStatus(orderId, 'Completed') }
        ]
    );
};

return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={26} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>To Review</Text>
        </View>

        <FlatList
            data={toReviewOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <OrderCard
                    order={item}
                    onReview={() => handleReviewOrder(item.id)}
                />
            )}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Icon name="star-half-full" size={70} color="#CCC" />
                    <Text style={styles.emptyText}>No orders to review.</Text>
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
cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
orderId: { fontSize: 13, color: '#868E96' },
orderStatus: { fontSize: 13, fontWeight: 'bold', color: '#9B59B6' },
cardBody: { flexDirection: 'row', padding: 14 },
itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 14, backgroundColor: '#EAEAEA' },
itemDetails: { flex: 1, justifyContent: 'center' },
itemName: { fontSize: 16, fontWeight: '600', color: '#343A40', marginBottom: 4 },
moreItemsText: { fontSize: 12, color: '#ADB5BD' },
cardFooter: { padding: 10, alignItems: 'flex-end' },
actionButton: { backgroundColor: '#EE2323', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
emptyText: { marginTop: 20, fontSize: 17, color: '#ADB5BD' },
});
export default ToReview;