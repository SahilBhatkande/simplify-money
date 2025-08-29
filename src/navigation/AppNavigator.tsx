import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { MetalDetailsScreen } from '../screens/MetalDetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  MetalDetails: {
    metalType: 'gold' | 'silver' | 'platinum' | 'palladium';
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F8F9FA' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MetalDetails" component={MetalDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

