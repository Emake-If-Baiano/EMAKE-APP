import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
    return <Image source={require('../../assets/logo_if.png')} style={styles.image} />
}

const styles = StyleSheet.create({
    image: {
        width: 130,
        height: 150,
        marginBottom: 0,
    },
})
