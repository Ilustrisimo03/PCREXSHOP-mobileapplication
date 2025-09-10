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

const OrderCard = ({ order, onReview }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Text style={[styles.orderId, { fontFamily: 'Rubik-Regular' }]}>Order ID: {order.id}</Text>
            <Text style={[styles.orderStatus, { fontFamily: 'Rubik-Bold' }]}>{order.status}</Text>
        </View>
        {order.items.map(item => <OrderItem key={item.id} item={item} />)}
        <View style={styles.cardFooter}>
            <TouchableOpacity style={styles.actionButton} onPress={onReview}>
                <Text style={[styles.buttonText, { fontFamily: 'Rubik-Bold' }]}>Rate Product</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const ToReview = ({ navigation }) => {
    const { orders, updateOrderStatus } = useOrders();
    const toReviewOrders = useMemo(() => orders.filter(order => order.status === 'To Review'), [orders]);

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

    const handleReviewOrder = (orderId) => {
        setConfirmConfig({
            title: "Rate Product",
            message: "This will mark the order as 'Completed'. A real app would open a detailed review screen.",
            onConfirm: () => {
                updateOrderStatus(orderId, 'Completed');
                showSuccessToast('Order Completed!');
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
                <Text style={[styles.headerTitle, { fontFamily: 'Rubik-Bold' }]}>To Review</Text>
            </View>
            <FlatList
                data={toReviewOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<OrderCard order={item} onReview={() => handleReviewOrder(item.id)} />)}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<View style={styles.emptyContainer}><Icon name="star-half-full" size={70} color="#CCC" /><Text style={[styles.emptyText, { fontFamily: 'Rubik-Regular' }]}>No orders to review.</Text></View>}
            />
            <Modal transparent={true} visible={isConfirmModalVisible} onRequestClose={() => setConfirmModalVisible(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setConfirmModalVisible(false)}>
                    <Pressable style={styles.alertModalContainer}>
                        
                        <Text style={[styles.alertModalTitle, { fontFamily: 'Rubik-Bold' }]}>{confirmConfig.title}</Text>
                        <Text style={[styles.alertModalMessage, { fontFamily: 'Rubik-Regular' }]}>{confirmConfig.message}</Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.modalButton, styles.modalSecondaryButton]} onPress={() => setConfirmModalVisible(false)}>
                                <Text style={[styles.modalButtonTextSecondary, { fontFamily: 'Rubik-Bold' }]}>Later</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.modalPrimaryButton]} onPress={() => { confirmConfig.onConfirm(); setConfirmModalVisible(false); }}>
                                <Text style={[styles.modalButtonTextPrimary, { fontFamily: 'Rubik-Bold' }]}>Mark as Completed</Text>
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
    card: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
    orderId: { fontSize: 13, color: '#868E96' }, // Applied fontFamily directly to Text
    orderStatus: { fontSize: 13, color: '#9B59B6' }, // Applied fontFamily directly to Text
    orderItemContainer: { flexDirection: 'row', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
    orderItemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 14, backgroundColor: '#EAEAEA' },
    orderItemDetails: { flex: 1, justifyContent: 'center' },
    orderItemName: { fontSize: 15, color: '#343A40' }, // Applied fontFamily directly to Text
    orderItemQuantity: { fontSize: 14, color: '#868E96', marginTop: 4 }, // Applied fontFamily directly to Text
    orderItemPrice: { fontSize: 15, color: '#495057' }, // Applied fontFamily directly to Text
    cardFooter: { padding: 10, alignItems: 'flex-end', borderTopWidth: 1, borderTopColor: '#F1F3F5' },
    actionButton: { backgroundColor: '#EE2323', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
    buttonText: { color: '#FFF', fontSize: 14 }, // Applied fontFamily directly to Text
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

export default ToReview;