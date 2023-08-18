
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Header from '../../components/Header';


export default function loading() {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
        }}>
            <Header customStyle={{
                color: "white",
                fontSize: 25
            }}>
                Carregando...{" "}
            </Header>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )
}