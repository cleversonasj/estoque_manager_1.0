import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomModal = ({ visible, onClose, message, onConfirm, showConfirm = false }) => {
    const fadeAnim = new Animated.Value(0);

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start();
    };

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start();
    };

    if (visible) fadeIn();
    else fadeOut();

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Atenção</Text>
                    <Text style={styles.modalText}>{message}</Text>
                    <View style={styles.modalButtons}>
                        {showConfirm && (
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={onConfirm}
                            >
                                <Icon name="check" size={24} color="#fff" style={styles.icon} />
                                <Text style={styles.modalButtonText}>Apagar</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[styles.modalButton, styles.closeButton]}
                            onPress={onClose}
                        >
                            <Icon name="close" size={24} color="#fff" style={styles.icon} />
                            <Text style={styles.modalButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </Modal>
    );
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
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        paddingBottom: 30,
        paddingTop: 30,
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 32,
        color: '#007BFF',
        fontWeight: 'bold',
    },
    modalText: {
        fontSize: 16,
        marginTop: 15,
        marginBottom: 25,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
    },
    modalButton: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        backgroundColor: '#28A745',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    icon: {
        color: '#fff',
    },
    confirmButton: {
        backgroundColor: '#28A745',
    },
});

export default CustomModal;
