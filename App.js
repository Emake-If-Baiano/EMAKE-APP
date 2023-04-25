import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  StartScreen,
} from './src/screens'

const Stack = createStackNavigator()

export default function App() {

  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#FFFFFF' }
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
