import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native'
import Animated, { interpolateColors, multiply, useValue } from 'react-native-reanimated';
import { SLIDE_HEIGHT, Slide } from './Slide';
import Sub from '../../components/sub'
//import { onScrollEvent } from "react-native-redash";

const { width } = Dimensions.get('window');
const BORDER_RADIUS = 75
const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: 'white'
  },
  slider: {
    height: SLIDE_HEIGHT,
    //backgroundColor: 'cyan',
    borderBottomRightRadius: BORDER_RADIUS
  },
  footer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1,
    borderTopLeftRadius: BORDER_RADIUS,
    flexDirection: 'row'
  }
})

const slides = [
  { label: "News", subTitle: " abc", des: " asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf asdfasdfasdf ", color: "#BFEAF5" },
  { label: "Feeds", subTitle: " def", des: " rtghdfgthfgh rtghdfgthfgh rtghdfgthfgh rtghdfgthfgh rtghdfgthfgh", color: "#BEECC4" },
  { label: "Games", subTitle: " jkg", des: "eruertuertu eruertuertu eruertuertu eruertuertu eruertuertu eruertuertu", color: "#FFE4D9" },
  { label: "Movies", subTitle: " hmi", des: "ertuertuertuertu ertuertuertuertu ertuertuertuertu ertuertuertuertu ertuertuertuertu", color: "#FFDDDD" },
]
const App = () => {
  const x = useValue(0);
  const backgroundColor = interpolateColors(x, {
    inputRange: slides.map((_, index) => width * index),
    outputColorRange: slides.map((slide) => slide.color),
  })
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slider, { backgroundColor: backgroundColor }]}>
        <Animated.ScrollView
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={1}
          onScroll={(event) => { x.setValue(event.nativeEvent.contentOffset.x) }}
        >
          {
            slides.map(({ label, color }, index, item) => (
              <Slide key={index} label={label} right={(index % 2)} />
            ))
          }
        </Animated.ScrollView>
      </Animated.View>
      <View style={styles.footer}>
        <Animated.View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: backgroundColor }}>

        </Animated.View>
        <Animated.View style={[styles.footerContainer, {
          width: width * slides.length,
          flex: 1,
          transform: [{ translateX: multiply(x, -1) }]
        }]}>
          {
            slides.map(({ subTitle, des }, index) => (
              <Sub
                key={index}
                last={index === slides.length - 1}
                subTitle={subTitle}
                des={des}
              />
            ))
          }
        </Animated.View>
        {/* <View style={styles.footerContainer}>

        </View> */}
      </View>
    </View>
  )
}
export default App
