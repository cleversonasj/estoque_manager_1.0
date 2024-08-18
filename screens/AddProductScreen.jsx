import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Keyboard, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomModal from './CustomModal';

export default function AddProductScreen() {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [quantity, setQuantity] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState('');
    const [loading, setLoading] = useState(false);

    let valueInputRef = null;
    let quantityInputRef = null;
    let minQuantityInputRef = null;

    const pickImage = async () => {
        let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (result.granted === false) {
            alert('É necessária permissão para acessar suas fotos.');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setImage(pickerResult.assets[0].uri);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('value', value);
        formData.append('quantity', quantity);
        formData.append('minQuantity', minQuantity);

        if (image) {
            const localUri = image;
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('image', {
                uri: localUri,
                name: filename,
                type: type,
            });
        }

        try {
            const response = await fetch('http://192.168.0.233:3000/api/products', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors.join('\n'));
            }

            setModalText('Produto salvo com sucesso!');
            setModalVisible(true);
        } catch (error) {
            setModalText(error.message);
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setName('');
        setValue('');
        setQuantity('');
        setMinQuantity('');
        setImage(null);
    };

    const handleValueChange = (text) => {
        const validText = text.replace(/[^0-9.]/g, '');
        const parts = validText.split('.');
        if (parts.length > 2) {
            return;
        }
        setValue(validText);
    };

    const handleQuantityChange = (text) => {
        const validText = text.replace(/[^0-9]/g, '');
        setQuantity(validText);
    };

    const handleMinQuantityChange = (text) => {
        const validText = text.replace(/[^0-9]/g, '');
        setMinQuantity(validText);
    };

    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Nome do Produto</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome do produto"
                    value={name}
                    onChangeText={setName}
                    returnKeyType="next"
                    onSubmitEditing={() => valueInputRef.focus()}
                    blurOnSubmit={false}
                />

                <Text style={styles.label}>Valor do Produto</Text>
                <TextInput
                    ref={(input) => (valueInputRef = input)}
                    style={styles.input}
                    placeholder="Digite o valor do produto"
                    value={value}
                    onChangeText={handleValueChange}
                    keyboardType="numeric"
                    returnKeyType="next"
                    onSubmitEditing={() => quantityInputRef.focus()}
                    blurOnSubmit={false}
                />

                <Text style={styles.label}>Quantidade Atual</Text>
                <TextInput
                    ref={(input) => (quantityInputRef = input)}
                    style={styles.input}
                    placeholder="Digite a quantidade"
                    value={quantity}
                    onChangeText={handleQuantityChange}
                    keyboardType="numeric"
                    returnKeyType="next"
                    onSubmitEditing={() => minQuantityInputRef.focus()}
                    blurOnSubmit={false}
                />

                <Text style={styles.label}>Quantidade Mínima</Text>
                <TextInput
                    ref={(input) => (minQuantityInputRef = input)}
                    style={styles.input}
                    placeholder="Digite a quantidade mínima"
                    value={minQuantity}
                    onChangeText={handleMinQuantityChange}
                    keyboardType="numeric"
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                />

                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    <Icon name="image" size={24} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Escolher Imagem</Text>
                </TouchableOpacity>

                {image && <Image source={{ uri: image }} style={styles.image} />}

                <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                    <Icon name="save" size={24} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar Produto'}</Text>
                </TouchableOpacity>

                <CustomModal
                    visible={modalVisible}
                    onClose={handleModalClose}
                    message={modalText}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    imagePicker: {
        backgroundColor: '#007BFF',
        padding: 15,
        marginBottom: 20,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
