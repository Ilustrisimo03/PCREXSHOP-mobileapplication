import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useOrders } from '../context/OrderContext';

const OrderItem = ({ item }) => (
    <View style={styles.orderItemContainer}>
        <Image source={{ uri: item?.images?.[0] }} style={styles.orderItemImage} />
        <View style={styles.orderItemDetails}>
            <Text style={[styles.orderItemName, { fontFamily: 'Rubik-SemiBold' }]} numberOfLines={2}>{item.name}</Text>
            <Text style={[styles.orderItemQuantity, { fontFamily: 'Rubik-Regular' }]}>Qty: {item.quantity || 1}</Text>
        </View>
        <Text style={[styles.orderItemPrice, { fontFamily: 'Rubik-Bold' }]}>₱{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString()}</Text>
    </View>
);

const OrderCard = ({ order, onCancel }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Text style={[styles.orderId, { fontFamily: 'Rubik-Regular' }]}>Order ID: {order.id}</Text>
            <Text style={[styles.orderStatus, { fontFamily: 'Rubik-Bold' }]}>{order.status}</Text>
        </View>
        <Text style={[styles.statusInfo, { fontFamily: 'Rubik-Regular' }]}>Your order is being prepared by the seller.</Text>
        {order.items.map(item => <OrderItem key={item.id} item={item} />)}
        <View style={styles.cardFooter}>
            <Text style={[styles.orderTotalLabel, { fontFamily: 'Rubik-Regular' }]}>Total:</Text>
            <Text style={[styles.orderTotalValue, { fontFamily: 'Rubik-Bold' }]}>₱{order.total.toLocaleString()}</Text>
        </View>
        <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={onCancel}>
                <Text style={[styles.buttonText, styles.cancelButtonText, { fontFamily: 'Rubik-Bold' }]}>Cancel Order</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const ToShip = ({ navigation }) => {
    const { orders, cancelOrder } = useOrders();
    const toShipOrders = useMemo(() => orders.filter(o => o.status === 'To Ship'), [orders]);

    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', onConfirm: () => {} });

    // === BAGONG STATE PARA SA SUCCESS TOAST ===
    const [isSuccessToastVisible, setSuccessToastVisible] = useState(false);
    const [successToastMessage, setSuccessToastMessage] = useState('');

    const showSuccessToast = (message) => {
        setSuccessToastMessage(message);
        setSuccessToastVisible(true);
        setTimeout(() => setSuccessToastVisible(false), 2000);
    };

    const handleCancelOrder = (orderId) => {
        setConfirmConfig({
            title: "Cancel Order",
            message: "Are you sure you want to cancel? This may not be possible if the seller has already processed it.",
            onConfirm: () => {
                cancelOrder(orderId);
                showSuccessToast('Order Cancelled');
            }
        });
        setConfirmModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" size={26} color="#333" />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { fontFamily: 'Rubik-Bold' }]}>To Ship</Text>
            </View>
            <FlatList
                data={toShipOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<OrderCard order={item} onCancel={() => handleCancelOrder(item.id)} />)}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<View style={styles.emptyContainer}><Icon name="package-variant-closed" size={70} color="#CCC" /><Text style={[styles.emptyText, { fontFamily: 'Rubik-Regular' }]}>You have no orders being shipped.</Text></View>}
            />
            <Modal transparent={true} visible={isConfirmModalVisible} onRequestClose={() => setConfirmModalVisible(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setConfirmModalVisible(false)}>
                    <Pressable style={styles.alertModalContainer}>
                        
                        <Text style={[styles.alertModalTitle, { fontFamily: 'Rubik-Bold' }]}>{confirmConfig.title}</Text>
                        <Text style={[styles.alertModalMessage, { fontFamily: 'Rubik-Regular' }]}>{confirmConfig.message}</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.modalButton, styles.modalSecondaryButton]} onPress={() => setConfirmModalVisible(false)}>
                                <Text style={[styles.modalButtonTextSecondary, { fontFamily: 'Rubik-Bold' }]}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.modalPrimaryButton]} onPress={() => { confirmConfig.onConfirm(); setConfirmModalVisible(false); }}>
                                <Text style={[styles.modalButtonTextPrimary, { fontFamily: 'Rubik-Bold' }]}>Yes, Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* === BAGONG SUCCESS TOAST MODAL === */}
            <Modal animationType="fade" transparent={true} visible={isSuccessToastVisible}>
                <View style={styles.toastOverlay}>
                    <View style={styles.toastContainer}>
                        <Text style={[styles.toastText, { fontFamily: 'Rubik-SemiBold' }]}>{successToastMessage}</Text>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// --- STYLES (with new toast styles) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
    headerTitle: { fontSize: 22, marginLeft: 16, color: '#212529' }, // Applied fontFamily directly to Text
    listContainer: { padding: 12 },
    card: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 5, overflow: 'hidden' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingTop: 14, paddingBottom: 8 },
    orderId: { fontSize: 13, color: '#868E96' }, // Applied fontFamily directly to Text
    orderStatus: { fontSize: 13, color: '#3498DB' }, // Applied fontFamily directly to Text
    statusInfo: { fontSize: 13, color: '#868E96', paddingHorizontal: 14, paddingBottom: 10 }, // Applied fontFamily directly to Text
    orderItemContainer: { flexDirection: 'row', padding: 14, borderTopWidth: 1, borderTopColor: '#F8F9FA' },
    orderItemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 14, backgroundColor: '#EAEAEA' },
    orderItemDetails: { flex: 1, justifyContent: 'center' },
    orderItemName: { fontSize: 15, color: '#343A40' }, // Applied fontFamily directly to Text
    orderItemQuantity: { fontSize: 14, color: '#868E96', marginTop: 4 }, // Applied fontFamily directly to Text
    orderItemPrice: { fontSize: 15, color: '#495057' }, // Applied fontFamily directly to Text
    cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 14, borderTopWidth: 1, borderTopColor: '#F1F3F5' },
    orderTotalLabel: { fontSize: 14, color: '#495057' }, // Applied fontFamily directly to Text
    orderTotalValue: { fontSize: 18, marginLeft: 8, color: '#212529' }, // Applied fontFamily directly to Text
    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#F1F3F5', padding: 10 },
    actionButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    cancelButton: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#DEE2E6' },
    buttonText: { fontSize: 14 }, // Applied fontFamily directly to Text
    cancelButtonText: { color: '#495057' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
    emptyText: { marginTop: 20, fontSize: 17, color: '#ADB5BD' }, // Applied fontFamily directly to Text
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    alertModalContainer: { width: '85%', backgroundColor: 'white', borderRadius: 15, paddingTop: 25, paddingBottom: 20, paddingHorizontal: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    alertModalTitle: { fontSize: 18, color: '#1C1C1C', marginBottom: 8, textAlign: 'center' }, // Applied fontFamily directly to Text
    alertModalMessage: { fontSize: 15, color: '#4A4A4A', textAlign: 'center', marginBottom: 25, lineHeight: 22 }, // Applied fontFamily directly to Text
    modalActions: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
    modalButton: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
    modalPrimaryButton: { backgroundColor: '#EE2323', marginLeft: 8 },
    modalSecondaryButton: { backgroundColor: '#F3F4F6', marginRight: 8, borderWidth: 1, borderColor: '#EAEAEA' },
    modalButtonTextPrimary: { color: 'white', fontSize: 16 }, // Applied fontFamily directly to Text
    modalButtonTextSecondary: { color: '#1C1C1C', fontSize: 16 }, // Applied fontFamily directly to Text

    // Toast Styles
    toastOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' },
    toastContainer: { backgroundColor: '#333333', borderRadius: 10, paddingVertical: 15, paddingHorizontal: 25, alignItems: 'center', elevation: 5 },
    toastText: { color: '#FFFFFF', fontSize: 16, textAlign: 'center' }, // Applied fontFamily directly to Text
});

export default ToShip;