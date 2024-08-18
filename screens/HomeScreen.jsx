import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

export default function HomeScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace('Menu');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.logoContainer, opacity: fadeAnim }}>
        <Text style={styles.companyName}>ReyTech</Text>
        <Text style={styles.description}>Climatização e Segurança Eletrônica</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc222',
  },
  companyName: {
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-condensed',
  },
  description: {
    fontFamily: 'sans-serif-condensed',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },
  text: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
