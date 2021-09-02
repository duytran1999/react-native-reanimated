import React from 'react'
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native'
import Animated, { interpolateColors, useValue } from 'react-native-reanimated';
//import { SLIDE_HEIGHT } from '../screen/SlideAnimated/Slide'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center", justifyContent: 'center',
        padding: 24,
        borderTopLeftRadius: 75,
        backgroundColor: 'white'

    },
    subTitle: {
        fontWeight: '800',
        fontSize: 30,
        textAlign: 'center'
    },
    des: {
        fontStyle: 'italic',
        textAlign: 'center'
    }
})
const sub = ({ subTitle, des }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.subTitle}>
                {subTitle}
            </Text>
            <Text style={styles.des}>
                {des}
            </Text>
        </View>
    )
}

export default sub
