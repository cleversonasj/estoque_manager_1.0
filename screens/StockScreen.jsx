import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomModal from './CustomModal';
import ProductDetailModal from './ProductDetailModal';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const defaultImage = require('../assets/no_image.png');

export default function StockScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState('');
    const [productToDelete, setProductToDelete] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = () => {
        setLoading(true);
        axios.get('http://192.168.0.233:3000/api/products')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                setModalText('O servidor está indisponível. Tente novamente mais tarde.');
                setModalVisible(true);
                setLoading(false);
            });
    };

    useFocusEffect(
        useCallback(() => {
            fetchProducts();
        }, [])
    );

    const handleEdit = (product) => {
        navigation.navigate('EditProduct', { product });
    };

    const handleDelete = (id) => {
        setProductToDelete(id);
        setModalText('Você realmente deseja excluir este produto?');
        setModalVisible(true);
    };

    const confirmDelete = () => {
        axios.delete(`http://192.168.0.233:3000/api/products/${productToDelete}`)
            .then(() => {
                setProducts(products.filter(product => product.id !== productToDelete));
                setProductToDelete(null);
                setModalVisible(false);
            })
            .catch(error => {
                setModalText('Erro ao excluir o produto. Tente novamente mais tarde.');
                setModalVisible(true);
            });
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setProductToDelete(null);
        setSelectedProduct(null);
    };

    const handleProductPress = (product) => {
        setSelectedProduct(product);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleProductPress(item)} style={styles.item}>
            <List.Item
                title={() => (<Text style={styles.title}>{item.name}</Text>)}
                description={() => (
                    <View>
                        <Text>Preço: {formatCurrency(item.value)}</Text>
                        <Text>Quant. Atual: {item.quantity}</Text>
                        <Text
                            style={[
                                styles.text,
                                item.quantity < item.minQuantity && styles.warningText
                            ]}
                        >Quant. Mínima: {item.minQuantity}</Text>
                    </View>
                )}
                left={() => (
                    <Image
                        source={item.image ? { uri: `http://192.168.0.233:3000/uploads/${item.image}` } : defaultImage}
                        style={styles.image}
                    />
                )}
                right={() => (
                    <View style={styles.buttons}>
                        <IconButton icon="pencil" onPress={() => handleEdit(item)} />
                        <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
                    </View>
                )}
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007BFF" />
                    <Text style={styles.loadingText}>Carregando produtos...</Text>
                </View>
            ) : products.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="error-outline" size={50} color="#555" />
                    <Text style={styles.emptyText}>Nenhum produto localizado.</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            )}

            <CustomModal
                visible={modalVisible}
                onClose={handleModalClose}
                message={modalText}
                onConfirm={productToDelete ? confirmDelete : null}
                showConfirm={!!productToDelete}
            />

            {selectedProduct && (
                <ProductDetailModal
                    visible={!!selectedProduct}
                    onClose={handleModalClose}
                    product={selectedProduct}
                    fetchProducts={fetchProducts}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#555',
        marginTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#555',
        marginTop: 10,
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 8,
    },
    buttons: {
        alignItems: 'center',
    },
    item: {
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    warningText: {
        color: 'red',
        fontWeight: 'bold',
    },
});
