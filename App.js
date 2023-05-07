import React, { useEffect, useState } from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  StartScreen,
  Login,
  Dashboard,
  Config,
  Notificações,
  Perfil,
  Dados
} from './src/screens'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createStackNavigator()

export default function App() {

  const [exists, setExists] = useState(undefined)
  useEffect(() => {
    AsyncStorage.getItem("userinfo").then(res => {
      setExists(res);
    })
  }, []);

  if (exists === undefined) return;

  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={exists ? "Login" : "StartScreen"}
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
          <Stack.Screen name="Perfil" headerShown={true} component={Perfil} />
          <Stack.Screen name="Dados" headerShown={true} component={Dados} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
