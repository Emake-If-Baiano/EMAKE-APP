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
  Boletim,
  Turmas,
  Calendario
} from './src/screens'

import AsyncStorage from '@react-native-async-storage/async-storage'

import * as Notifications from 'expo-notifications'

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

import register from './src/services/BoletimChecker'
import { ImageBackground, View } from 'react-native'
import Header from './src/components/Header'

import { BlurView } from '@react-native-community/blur';
import { Image } from 'react-native'
import { Modal } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Linking } from 'react-native'

import { ProgressBar, MD3Colors } from 'react-native-paper';

import * as Updates from 'expo-updates';

const version = 1;

export default function App() {

  const [exists, setExists] = useState(undefined);

  const [update, setUpdate] = useState(false);

  const [percent, setPercent] = useState(0);

  const [updating, setUpdating] = useState(false);

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdate(true);
      }
    } catch (error) {
      alert(`Ocorreu um eror ao atualizar. Por favor, contate o desenvolvedor no instagram: @emake.app -  ${error}`);
    }
  }

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

          axios.post("https://vps.paulo-valadares.com/postToken", {
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
    setInterval(() => {
      if (update) return;

      onFetchUpdateAsync();
    }, 15000);

    onFetchUpdateAsync();

    register.register();

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
        AsyncStorage.getItem("firstTime").then(res2 => {
          if (!res2) {
            setExists(null);

            AsyncStorage.setItem("firstTime", "true");
          } else {
            setExists(false);
          }
        })
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

  if (update) return (

    <View style={{
      flex: 1,
      backgroundColor: "#29473b",
      justifyContent: "center",
      alignItems: "center"
    }}>

      <Image
        source={require('./assets/logo.png')}
        blurRadius={2.5}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
      >
        <View style={{
          flex: 1,
          alignItems: 'center',
          marginTop: "25%"
        }}>
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            width: '80%',
            borderRadius: 10,
            alignItems: 'center',
            shadowColor: "black",
            shadowOffset: { width: -5, height: 10 },
            shadowOpacity: 1,
            shadowRadius: 10,
            elevation: 10,
            flex: 0.25,
            justifyContent: "space-around"
          }}>
            <Header customStyle={{
              fontSize: 22,
              color: "#004AAD",
              fontWeight: "bold",
              flex: 0.5,
              width: "100%",
              textAlign: "center"
            }}>
              Atualize para continuar utilizando!
            </Header>

            <TouchableOpacity style={{
              width: "100%",
              flex: 0.2,
            }} onPress={async () => {
              try {
                Updates.fetchUpdateAsync();

                const inter = setInterval(() => {
                  setPercent(p => {
                    if (p === 100) {
                      clearInterval(inter);

                      setUpdate(false);

                      Updates.reloadAsync();
                      return 100
                    } else {
                      return p + 2;
                    }
                  })
                }, 200)

                setUpdating(true);
              } catch (error) {
                alert(`Ocorreu um eror ao atualizar. Por favor, contate o desenvolvedor no instagram: @emake.app -  ${error}`);
              }
            }}>
              <Header customStyle={{
                fontSize: 20,
                color: "blue",
                fontWeight: "bold",
                textAlign: "center"
              }}>{updating ? "Atualizando..." : "Clique para atualizar"}</Header>
            </TouchableOpacity>

            {updating && <View style={{
              flex: 0.15,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center"
            }}>
              <View style={{
                flex: 0.9
              }}>
                <ProgressBar progress={percent / 100} color="blue" style={{
                  alignSelf: "center",
                  borderRadius: 10,
                  backgroundColor: "white",
                  height: "100%",
                  width: "100%"
                }} />
              </View>

              <Header customStyle={{
                fontSize: 20,
                color: "blue",
                fontWeight: "bold",
                textAlign: "center"
              }}>{Math.floor(percent)}%</Header>
            </View>}
          </View>
        </View>
      </Modal >
    </View >
  )

  return (<Provider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={update ? "UpdateScreen" : exists === true ? "Dashboard" : exists === null ? "Initial" : "Login"}
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
        <Stack.Screen name="Turmas" headerShown={true} component={Turmas} />
        <Stack.Screen name="Calendario" headerShown={true} component={Calendario} />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>)
}