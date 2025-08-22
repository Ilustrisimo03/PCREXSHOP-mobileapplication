import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StatusBar,
  Image,
  Switch // Import Switch for the toggle
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useCart } from '../context/CartContext';

// Assumes Item.json is in a 'data' folder at the parent level
import Item from '../data/Item.json';

// --- COMPONENT & DATA STRUCTURE ---
const componentStructure = [
    { id: 'cpu', name: 'Processor (CPU)', type: 'Processor', required: true, icon: 'chip' },
    { id: 'motherboard', name: 'Motherboard', type: 'Motherboard', required: true, icon: 'server' },
    { id: 'memory', name: 'Memory (RAM)', type: 'Memory (RAM)', required: true, icon: 'memory' },
    { id: 'storage', name: 'Storage (HDD / SSD)', type: 'Storage (HDD / SSD)', required: true, icon: 'harddisk' },
    { id: 'gpu', name: 'Graphics Card (GPU)', type: 'Graphics Card', required: false, icon: 'gamepad-variant' },
    { id: 'pccase', name: 'PC Case', type: 'PC Case', required: true, icon: 'package-variant-closed' },
    { id: 'psu', name: 'Power Supply (PSU)', type: 'Power Supply', required: true, icon: 'power-plug' },
    { id: 'cpu_cooler', name: 'CPU Cooler', type: 'CPU Cooling', required: false, icon: 'fan' }
];

// --- UTILITY & COMPATIBILITY LOGIC ---
const getAttribute = (product, keywords) => {
    if (!product) return null;
    const text = `${product.name} ${product.description}`.toLowerCase();
    for (const keyword of keywords) {
        if (text.includes(keyword.toLowerCase())) return keyword;
    }
    return null;
};
const getCpuSocket = (product) => getAttribute(product, ['AM4', 'AM5', 'LGA 1700']);
const getRamType = (product) => getAttribute(product, ['DDR4', 'DDR5']);
const getRamFormFactor = (product) => getAttribute(product, ['SODIMM']);
const getMoboFormFactor = (product) => getAttribute(product, ['Micro-ATX', 'Micro ATX']);


// --- REACT NATIVE COMPONENT ---
const Builder = () => {
    
    const navigation = useNavigation();
    // --- (FIX 1) --- Inayos ang pangalan ng function para tumugma sa CartContext ---
    const { addToCart } = useCart();
    const [allProducts, setAllProducts] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentSlot, setCurrentSlot] = useState(null);
    const [showOnlyCompatible, setShowOnlyCompatible] = useState(true); // State for the toggle

    // --- FONT LOADING ---
    const [fontsLoaded] = useFonts({
      'Roboto-Regular': require('../assets/fonts/Roboto/static/Roboto_Condensed-Regular.ttf'),
      'Roboto-Medium': require('../assets/fonts/Roboto/static/Roboto_Condensed-Medium.ttf'),
      'Roboto-Bold': require('../assets/fonts/Roboto/static/Roboto_Condensed-Bold.ttf'),
      'Roboto-SemiBold': require('../assets/fonts/Roboto/static/Roboto_Condensed-SemiBold.ttf'),
    });

    // --- DATA LOADING ---
    useEffect(() => {
        setAllProducts(Item);
        setIsLoading(false);
    }, []);

    // --- RECOMMENDATION ENGINE (for modal) ---
    const getCompatibilityInfo = (product, productType, currentSelection) => {
        const { cpu, motherboard } = currentSelection;

        if (productType === 'Motherboard' && cpu) {
            const cpuSocket = getCpuSocket(cpu);
            const moboSocket = getCpuSocket(product);
            if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
                return { compatible: false, reason: `Socket Mismatch: Requires ${cpuSocket}` };
            }
        }

        if (productType === 'Processor' && motherboard) {
            const moboSocket = getCpuSocket(motherboard);
            const cpuSocket = getCpuSocket(product);
            if (moboSocket && cpuSocket && moboSocket !== cpuSocket) {
                return { compatible: false, reason: `Socket Mismatch: Requires ${moboSocket}` };
            }
        }

        if (productType === 'Memory (RAM)' && motherboard) {
            const moboRamType = getRamType(motherboard);
            const memRamType = getRamType(product);
            if (moboRamType && memRamType && moboRamType !== memRamType) {
                return { compatible: false, reason: `RAM Type Mismatch: Requires ${moboRamType}` };
            }
        }
        
        if (getRamFormFactor(product) === 'SODIMM') {
            return { compatible: false, reason: 'SODIMM RAM is for laptops, not desktops.'};
        }

        return { compatible: true, reason: null };
    };

    // --- COMPATIBILITY CHECK (for summary) ---
    const compatibilityResult = useMemo(() => {
        const issues = [];
        const { cpu, motherboard, memory, pccase, cpu_cooler } = selectedComponents;

        if (cpu && motherboard) {
            const cpuSocket = getCpuSocket(cpu);
            const moboSocket = getCpuSocket(motherboard);
            if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
                issues.push(`Socket Mismatch: CPU (${cpuSocket}) vs Motherboard (${moboSocket}).`);
            }
        }

        if (memory && motherboard) {
            const memType = getRamType(memory);
            const moboMemType = getRamType(motherboard);
            if (memType && moboMemType && memType !== moboMemType) {
                issues.push(`RAM Mismatch: Memory (${memType}) vs Motherboard (${moboMemType}).`);
            }
            if (getRamFormFactor(memory) === 'SODIMM') {
                issues.push(`Form Factor Warning: SODIMM RAM is for laptops, not desktops.`);
            }
        }

        if (pccase && motherboard) {
            const moboFormFactor = getMoboFormFactor(motherboard);
            const caseFormFactor = getMoboFormFactor(pccase);
             if (moboFormFactor && caseFormFactor && moboFormFactor !== caseFormFactor) {
                issues.push(`Fit Warning: Motherboard (${moboFormFactor}) may not fit in Case (${caseFormFactor}).`);
            }
        }

        if (cpu_cooler && cpu) {
            const cpuSocket = getCpuSocket(cpu);
             if (cpuSocket === 'AM5' && cpu_cooler.name.includes('Wraith Stealth')) {
                issues.push(`Cooling Warning: ${cpu_cooler.name} may be insufficient for ${cpu.name}.`);
            }
        }

        if (issues.length > 0) {
            return { compatible: false, status: 'issues', message: 'Compatibility Issues Found', details: issues };
        }

        const allRequiredMet = componentStructure.every(slot => !slot.required || selectedComponents[slot.id]);
        if (!allRequiredMet) {
             return { compatible: false, status: 'incomplete', message: 'Please select all required parts', details: [] };
        }

        return { compatible: true, status: 'compatible', message: 'Your build is compatible!', details: [] };
    }, [selectedComponents]);

    // --- CALCULATIONS ---
    const totalPrice = useMemo(() => {
        return Object.values(selectedComponents).reduce((total, product) => total + parseFloat(product.price), 0);
    }, [selectedComponents]);

    // --- EVENT HANDLERS ---
    const handleChoosePress = (slot) => {
        setCurrentSlot(slot);
        setModalVisible(true);
    };

    const handleSelectComponent = (product) => {
        setSelectedComponents(prev => ({ ...prev, [currentSlot.id]: product }));
        setModalVisible(false);
        setCurrentSlot(null);
    };

    const handleRemoveComponent = (slotId) => {
        setSelectedComponents(prev => {
            const newSelection = { ...prev };
            delete newSelection[slotId];
            return newSelection;
        });
    };

    const handleClearBuild = () => {
        Alert.alert( "Clear Build", "Are you sure you want to clear the entire build?",
            [ { text: "Cancel", style: "cancel" }, { text: "Yes", onPress: () => setSelectedComponents({}), style: 'destructive' } ]
        );
    };

    // --- (FIX 2) --- Inayos ang function para isa-isang idagdag ang bawat item ---
    const handleAddToCart = () => {
        if (!compatibilityResult.compatible) {
            Alert.alert(
                "Cannot Add to Cart",
                "Your build has compatibility issues or is incomplete. Please resolve them before proceeding."
            );
            return;
        }

        const buildItems = Object.values(selectedComponents);
        
        buildItems.forEach(item => {
            addToCart(item);
        });
        
        navigation.navigate('Cart');
        Alert.alert(
            "Build Added to Cart",
            `Your custom PC build with ${buildItems.length} items has been added to your cart.`
        );
    };

    // --- RENDER FUNCTIONS ---
    const renderStatus = () => {
        const { status, message, details } = compatibilityResult;
        let style = styles.statusInfo;
        let icon = 'information';
        let color = '#3b82f6';

        if (status === 'compatible') { style = styles.statusSuccess; icon = 'check-circle'; color = '#22c55e'; }
        else if (status === 'issues') { style = styles.statusWarning; icon = 'alert-circle'; color = '#f97316'; }

        if (Object.keys(selectedComponents).length === 0) {
            return ( <View style={styles.statusInfo}><Text style={styles.statusMessage}>Start by selecting a component.</Text></View> )
        }

        return (
            <View style={style}>
                <View style={styles.statusHeader}>
                    <Icon name={icon} size={18} color={color} style={{ marginRight: 8 }} />
                    <Text style={styles.statusMessage}>{message}</Text>
                </View>
                {details.length > 0 && (
                    <View style={styles.statusDetailsContainer}>
                        {details.map((issue, index) => <Text key={index} style={styles.statusDetailItem}>• {issue}</Text>)}
                    </View>
                )}
            </View>
        );
    };
    
    const renderModalProductList = () => {
        const availableProducts = allProducts.filter(p => p.type === currentSlot?.type);
        if (availableProducts.length === 0) {
            return <Text style={styles.noPartsText}>No parts available for this category.</Text>;
        }

        const filteredProducts = showOnlyCompatible
            ? availableProducts.filter(p => getCompatibilityInfo(p, currentSlot?.type, selectedComponents).compatible)
            : availableProducts;
            
        if (filteredProducts.length === 0) {
            return <Text style={styles.noPartsText}>No compatible parts found for your current selection.</Text>;
        }

        return (
            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => {
                    const { compatible, reason } = getCompatibilityInfo(item, currentSlot.type, selectedComponents);
                    return (
                        <TouchableOpacity 
                            style={[styles.productItem, !compatible && styles.incompatibleItem]} 
                            onPress={() => handleSelectComponent(item)}
                            disabled={!compatible}
                        >
                            {item.images && item.images.length > 0 && (
                                <Image source={{ uri: item.images[0] }} style={styles.productImageModal} />
                            )}
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{item.name}</Text>
                                {!compatible && (
                                    <Text style={styles.compatibilityWarningText}>
                                        <Icon name="alert-circle" size={12} /> Incompatible: {reason}
                                    </Text>
                                )}
                                <Text style={styles.productRating}>Rating: {item.rate}/5 ({item.review} reviews)</Text>
                            </View>
                            <View style={styles.productAction}>
                                <Text style={styles.productPrice}>₱{parseFloat(item.price).toFixed(2)}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        );
    };


    if (!fontsLoaded || isLoading) {
        return ( <View style={styles.centered}><ActivityIndicator size="large" color="#E31C25" /></View> );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor='#E31C25'/>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>PC Part Builder</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Build Summary</Text>
                    {renderStatus()}
                     <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Total Price:</Text>
                        <Text style={styles.priceValue}>₱{totalPrice.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.addToCartButton, !compatibilityResult.compatible && styles.disabledButton]}
                        onPress={handleAddToCart}
                        disabled={!compatibilityResult.compatible}
                    >
                         <Icon name="cart-plus" size={18} color="#FFFFFF" style={{ marginRight: 8 }}/>
                        <Text style={[styles.actionButtonText, {color: '#FFFFFF'}]}>Add to Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={handleClearBuild}>
                         <Icon name="trash-can-outline" size={18} color="#E31C25" style={{ marginRight: 8 }}/>
                        <Text style={[styles.actionButtonText, styles.clearButtonText]}>Clear Build</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { marginBottom: 40 }]}>
                    <Text style={styles.cardTitle}>Choose Your Components</Text>
                    {componentStructure.map(slot => {
                        const product = selectedComponents[slot.id];
                        return (
                            <View key={slot.id} style={styles.slotContainer}>
                                {product ? (
                                    <>
                                        {product.images && product.images.length > 0 ? (
                                            <Image source={{ uri: product.images[0] }} style={styles.slotImage} />
                                        ) : (
                                            <View style={styles.slotIconPlaceholder}><Icon name={slot.icon} size={24} color="#E31C25" /></View>
                                        )}
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.slotName}>{slot.name}</Text>
                                            <Text style={styles.slotProduct} numberOfLines={1}>{product.name}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={styles.slotPrice}>₱{parseFloat(product.price).toFixed(2)}</Text>
                                            <TouchableOpacity onPress={() => handleRemoveComponent(slot.id)}>
                                                <Text style={styles.changeButtonText}>Change</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name={slot.icon} size={19} color="#64748b" style={styles.slotIcon} />
                                            <Text style={styles.slotNameUnselected}>{slot.name}</Text>
                                            {slot.required && <Text style={styles.requiredText}>REQUIRED</Text>}
                                        </View>
                                        <TouchableOpacity style={styles.chooseButton} onPress={() => handleChoosePress(slot)}>
                                            <Text style={styles.chooseButtonText}>Choose</Text>
                                            <Icon name="chevron-right" size={16} color="#334155" />
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            <Modal animationType="slide" visible={isModalVisible} onRequestClose={() => setModalVisible(false)} >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select a {currentSlot?.name}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Icon name="close" size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>Show only compatible parts</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#fca5a5" }}
                            thumbColor={showOnlyCompatible ? "#E31C25" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setShowOnlyCompatible(previousState => !previousState)}
                            value={showOnlyCompatible}
                        />
                    </View>
                    {renderModalProductList()}
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

// --- STYLES ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF', paddingBottom: Platform.OS === 'ios' ? 80 : 60 },
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4F8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EAEAEA', backgroundColor: '#E31C25' },
    headerTitle: { fontSize: 20, fontFamily: 'Roboto-Medium', color: "#FFFFFF" },
    card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginHorizontal: 16, marginTop: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3.84, elevation: 5 },
    cardTitle: { fontSize: 20, fontFamily: 'Roboto-Medium', color: '#1C1C1C', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 8 },
    statusInfo: { backgroundColor: '#eff6ff', padding: 12, borderRadius: 8, marginBottom: 12 },
    statusSuccess: { backgroundColor: '#f0fdf4', padding: 12, borderRadius: 8, marginBottom: 12 },
    statusWarning: { backgroundColor: '#fff7ed', padding: 12, borderRadius: 8, marginBottom: 12 },
    statusHeader: { flexDirection: 'row', alignItems: 'center' },
    statusMessage: { fontSize: 15, fontFamily: 'Roboto-Medium', color: '#1e293b' },
    statusDetailsContainer: { marginTop: 8, paddingLeft: 8 },
    statusDetailItem: { fontSize: 14, fontFamily: 'Roboto-Regular', color: '#475569' },
    priceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 16, marginTop: 4 },
    priceLabel: { fontSize: 18, fontFamily: 'Roboto-Medium', color: '#1C1C1C' },
    priceValue: { fontSize: 26, fontFamily: 'Roboto-Medium', color: '#E31C25' },
    actionButton: { paddingVertical: 12, borderRadius: 8, marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    actionButtonText: { fontSize: 16, fontFamily: 'Roboto-Medium' },
    addToCartButton: { backgroundColor: '#22c55e' },
    clearButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E31C25' },
    clearButtonText: { color: '#E31C25' },
    disabledButton: { opacity: 0.5, backgroundColor: '#9ca3af' },
    slotContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    slotImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12, backgroundColor: '#e2e8f0' },
    slotIconPlaceholder: { width: 50, height: 50, borderRadius: 8, marginRight: 12, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center' },
    slotIcon: { width: 20, marginRight: 12, textAlign: 'center' },
    slotName: { fontSize: 13, fontFamily: 'Roboto-Regular', color: '#334155' },
    slotNameUnselected: { fontSize: 14, fontFamily: 'Roboto-Bold', color: '#334155' },
    slotProduct: { fontSize: 14, fontFamily: 'Roboto-Regular', color: '#64748b', marginTop: 2 },
    slotPrice: { fontSize: 16, fontFamily: 'Roboto-Medium', color: '#1e293b' },
    requiredText: { color: '#ef4444', fontSize: 10, fontFamily: 'Roboto-Medium', marginLeft: 8, alignSelf: 'center' },
    chooseButton: { backgroundColor: '#e2e8f0', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
    chooseButtonText: { color: '#334155', fontFamily: 'Roboto-Medium', marginRight: 6 },
    changeButtonText: { color: '#E31C25', fontFamily: 'Roboto-Medium', marginTop: 4, fontSize: 14 },
    modalContainer: { flex: 1, backgroundColor: '#FFFFFF' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    modalTitle: { fontSize: 20, fontFamily: 'Roboto-Medium', color: '#1C1C1C' },
    toggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    toggleLabel: { fontSize: 16, fontFamily: 'Roboto-Regular', color: '#334155' },
    separator: { height: 1, backgroundColor: '#e2e8f0' },
    productItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF' },
    incompatibleItem: { backgroundColor: '#fff7ed' },
    productImageModal: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#e2e8f0', marginRight: 16 },
    productInfo: { flex: 1, marginRight: 8 },
    productName: { fontSize: 16, fontFamily: 'Roboto-Medium', color: '#1e293b' },
    productDesc: { fontSize: 13, fontFamily: 'Roboto-Regular', color: '#64748b', marginTop: 4 },
    productRating: { fontSize: 12, color: '#94a3b8', marginTop: 8 },
    productAction: { alignItems: 'flex-end', marginLeft: 12 },
    productPrice: { fontSize: 18, fontFamily: 'Roboto-Medium', color: '#E31C25', marginBottom: 8 },
    compatibilityWarningText: { color: '#f97316', fontFamily: 'Roboto-Medium', fontSize: 12, marginTop: 4 },
    noPartsText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#64748b', fontFamily: 'Roboto-Regular' },
});

export default Builder;