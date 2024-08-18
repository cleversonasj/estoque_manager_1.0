import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import StockScreen from './screens/StockScreen';
import AddProductScreen from './screens/AddProductScreen';
import EditProductScreen from './screens/EditProductScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Stock"
          component={StockScreen}
          options={{
            title: 'Estoque',
            headerStyle: {
              backgroundColor: '#3CB371',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{
            title: 'Cadastrar Produto',
            headerStyle: {
              backgroundColor: '#3CB371',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen name="EditProduct"
          component={EditProductScreen}
          options={{
            title: 'Editar Produto',
            headerStyle: {
              backgroundColor: '#3CB371',
            },
            headerTintColor: '#fff',
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
