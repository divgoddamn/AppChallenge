import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ResourceScreen from '../screens/ResourceScreen';
import MapScreen from '../screens/MapScreen';
import JobScreen from '../screens/JobScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4F8BF9',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'PathFinder' }}
        />
        <Stack.Screen 
          name="Resources" 
          component={ResourceScreen} 
          options={{ title: 'Resources' }}
        />
        <Stack.Screen 
          name="Map" 
          component={MapScreen} 
          options={{ title: 'Map View' }}
        />
        <Stack.Screen 
          name="Jobs" 
          component={JobScreen} 
          options={{ title: 'Job Opportunities' }}
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: 'PathFinder Assistant' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;