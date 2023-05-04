import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'

export default function Button({ mode, style, ...props }) {
    return (
        <PaperButton
            style={[
                styles.button,
                mode === 'outlined' && { backgroundColor: 'rgb(22, 216, 98)' },
                style,
            ]}
            labelStyle={[styles.text, mode === 'contained' && { color: 'white' }]}
            mode={mode}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        marginVertical: 10,
        paddingVertical: 2,
        backgroundColor: 'rgb(22, 216, 98)'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 26,
    },
})
