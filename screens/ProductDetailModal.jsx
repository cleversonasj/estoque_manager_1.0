import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import CustomModal from './CustomModal';
const defaultImage = require('../assets/no_image.png');

const ProductDetailModal = ({ visible, onClose, product, fetchProducts }) => {
    const [quantity, setQuantity] = useState('');
    const [showStockAdjustment, setShowStockAdjustment] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleEntrada = async () => {
        try {
            const response = await fetch(`http://192.168.0.233:3000/api/products/${product.id}/entrada`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: parseInt(quantity, 10) }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Erro ao registrar entrada';
                throw new Error(errorMessage);
            }

            setQuantity('');
            fetchProducts();
            onClose();
        } catch (error) {
            setErrorMessage(error.message);
            setErrorModalVisible(true);
        }
    };

    const handleSaida = async () => {
        try {
            const response = await fetch(`http://192.168.0.233:3000/api/products/${product.id}/saida`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: parseInt(quantity, 10) }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Erro ao registrar saída';
                throw new Error(errorMessage);
            }

            setQuantity('');
            fetchProducts();
            onClose();
        } catch (error) {
            setErrorMessage(error.message);
            setErrorModalVisible(true);
        }
    };

    const handleErrorModalClose = () => {
        setErrorModalVisible(false);
    };

    const handleQuantityChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setQuantity(numericValue);
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {!showStockAdjustment ? (
                        <>
                            <Text style={styles.modalTitle}>{product?.name}</Text>
                            <Image
                                source={product?.image ? { uri: `http://192.168.0.233:3000/uploads/${product.image}` } : defaultImage}
                                style={styles.modalImage}
                            />
                            <Text style={styles.modalText}>Venda: {formatCurrency(product?.value)}</Text>
                            <Text style={styles.modalText}>Quantidade Atual: {product?.quantity}</Text>
                            <Text
                                style={[
                                    styles.modalText,
                                    product?.quantity < product?.minQuantity && styles.warningText
                                ]}
                            >
                                Quantidade Mínima: {product?.minQuantity}
                            </Text>

                            <TouchableOpacity style={styles.buttonAdjustStock} onPress={() => setShowStockAdjustment(true)}>
                                <Text style={styles.buttonText}>Acerto de Estoque</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.modalTitle}>Acerto de Estoque</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite a quantidade"
                                value={quantity}
                                onChangeText={handleQuantityChange}
                                keyboardType="numeric"
                            />

                            <TouchableOpacity style={styles.buttonEntrada} onPress={handleEntrada}>
                                <Text style={styles.buttonText}>Registrar Entrada</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonSaida} onPress={handleSaida}>
                                <Text style={styles.buttonText}>Registrar Saída</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <CustomModal
                visible={errorModalVisible}
                onClose={handleErrorModalClose}
                message={errorMessage}
            />
        </Modal>
    );
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        width: '85%',
        paddingBottom: 30,
        paddingTop: 30,
        justifyContent: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 10,
    },
    modalImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    warningText: {
        color: 'red',
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#28A745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        width: '100%',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonEntrada: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    buttonSaida: {
        backgroundColor: '#DC3545',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        width: '100%',
        padding: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    buttonAdjustStock: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        width: '100%',
    },
});

export default ProductDetailModal;
