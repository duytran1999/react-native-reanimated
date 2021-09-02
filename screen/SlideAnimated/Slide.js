import React, { Component } from 'react'
import { Text, View, Dimensions, StyleSheet } from 'react-native'

const { width, height } = Dimensions.get("window");
export const SLIDE_HEIGHT = height * 0.61;


const styles = StyleSheet.create({
    container: {
        width: width
    },
    titleContainer: {

        justifyContent: 'center',
        height: 100,
    },
    title: {
        fontSize: 60,
        lineHeight: 60,
        color: "white",
        textAlign: "center",
        fontWeight: 'bold'
    }
})
export const Slide = ({ label, right }) => {
    const transform = [
        { translateY: (SLIDE_HEIGHT - 100) / 2 },
        { translateX: right ? (width / 2 - 50) : (-width / 2 + 50) },
        { rotate: right ? "-90deg" : "90deg" }
    ]
    return (
        <View style={styles.container}>
            <View style={[styles.titleContainer, { transform }]}>
                <Text style={styles.title}>
                    {label}
                </Text>
            </View>
        </View>
    )
}