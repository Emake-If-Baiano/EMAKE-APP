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
  Dados,
  Documentos,
  Boletim
} from './src/screens'

import AsyncStorage from '@react-native-async-storage/async-storage'

import * as Notifications from 'expo-notifications'

import * as Device from 'expo-device'

const Stack = createStackNavigator()

import SUAP from './src/services/SUAP'

import axios from 'axios'

import * as Keychain from 'react-native-keychain'


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

import messaging from '@react-native-firebase/messaging';
import loading from './src/screens/loading'

export default function App() {

  const [exists, setExists] = useState(undefined);

  const tryLogin = (user, password) => {

    SUAP.Login(user, password).then(async data => {
      if (!data) {
        setExists(false)
      } else {

        Keychain.setGenericPassword(user, password);

        AsyncStorage.setItem("userinfo", JSON.stringify({
          user: user,
          password: password,
          token: data.access,
        }));

        setExists(true)

        Notifications.getDevicePushTokenAsync().then(tokenn => {

          AsyncStorage.setItem("token", tokenn.data)

          axios.post("http://35.247.244.48:25566/postToken", {
            user: user,
            password: password,
            token: tokenn.data,
          })
        })
      }
    }).catch(err => {
      setExists(true);
    })
  }

  useEffect(() => {

    AsyncStorage.getItem("token").then(token => {
      console.log(token)
      if (!token) {
        console.log("GETTING TOKEN")
        messaging().getToken().then(tokenn => {
          console.log(tokenn)
          AsyncStorage.setItem("token", tokenn)
        })
      }
    })

    AsyncStorage.getItem("userinfo").then(res => {
      if (!res) {
        setExists(false)
        return;
      }
      const parse = JSON.parse(res);

      tryLogin(parse.user, parse.password);

      setExists(true);
    })

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  if (exists === undefined) return loading()

  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={exists ? "Dashboard" : "Login"}
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
          <Stack.Screen name="Documentos" headerShown={true} component={Documentos} />
          <Stack.Screen name="Boletim" headerShown={true} component={Boletim} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
