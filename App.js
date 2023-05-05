import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  StartScreen,
  Login,
  Dashboard,
  Config,
  Notificações
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
            cardStyle: { backgroundColor: 'rgb(28, 28, 28)' },
            detachPreviousScreen: true,
            presentation: 'transparentModal'
          }}
        >
          <Stack.Screen name="StartScreen" headerShown={true} component={StartScreen} />
          <Stack.Screen name="Login" headerShown={true} component={Login} />
          <Stack.Screen name="Dashboard" headerShown={true} component={Dashboard} />
          <Stack.Screen name="Config" headerShown={true} component={Config} />
          <Stack.Screen name="Notificações" headerShown={true} component={Notificações} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
