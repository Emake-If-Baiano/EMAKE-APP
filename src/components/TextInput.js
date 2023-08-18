import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { TextInput } from 'react-native-paper'
import { Button, Input } from 'react-native-elements';

export default function TextInputFunc({ errorText, description, ...props }) {
    return (
        <View style={styles.container}>
            <Input
            
                inputContainerStyle={[styles.input, props.style]}
                inputStyle={{ color: "white"}}
                selectionColor="white"
                labelStyle={{
                    color: "red",
                    fontSize: 13,
                    padding: 1.5
                }}
                mode="flat"
                borderRadius={8}
                {...props}
            />
            {description && !errorText ? (
                <Text style={styles.description}>{description}</Text>
            ) : null}
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
    },
    input: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        borderColor: "white",
        borderStartWidth: 2,
        borderTopWidth: 2,
        boderLeftWidth: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        paddingLeft: 15,
        paddingRight: 5,
        color: "white"
    },
    description: {
        fontSize: 13,
        color: 'green',
        paddingTop: 8,
    },
    error: {
        fontSize: 13,
        color: 'red',
        paddingTop: 8,
    },
})
