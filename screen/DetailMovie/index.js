import React from "react";
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";

const { width, height } = Dimensions.get("window");

const ITEM_SUB_MOVIE_WIDTH = width / 3.2;
const ITEM_SUB_MOVIE_HEIGHT = ITEM_SUB_MOVIE_WIDTH * 1.2;

const HEIGHT_VIEW_TOP_CONNER = height * 0.36;

const ITEM_MAIN_MOVIE_WIDTH = width / 2.2;
const ITEM_MAIN_MOVIE_HEIGHT = ITEM_MAIN_MOVIE_WIDTH * 1.2;
const MarginCenter = width / 2 - ITEM_MAIN_MOVIE_WIDTH / 2;

const Difference_Height = 40;

const View_Item_Left = () => {
  return <View style={[styles.imageLeft, { backgroundColor: "black" }]} />;
};

const View_Item_Right = () => {
  return <View style={[styles.imageRight, { backgroundColor: "black" }]} />;
};

const DetailMovie = ({ navigation, route }) => {
  const { item, itemLeft, itemRight } = route.params;
  return (
    <View style={{ flex: 1, backgroundColor: "yellow" }}>
      {/* HEADER */}
      <View
        style={{ backgroundColor: "#1e272e", height: HEIGHT_VIEW_TOP_CONNER }}
      >
        {/* ITEM_LEFT */}
        {itemLeft === 0 ? (
          <View_Item_Left />
        ) : (
          <Image
            style={[styles.imageLeft]}
            source={{ uri: itemLeft.poster }}
            blurRadius={2}
          />
        )}
        {/* ITEM_CENTER */}
        <SharedElement
          id={`item.${item.key}.poster`}
          style={[styles.imageCenter]}
        >
          <Image
            style={{
              width: ITEM_MAIN_MOVIE_WIDTH,
              height: ITEM_MAIN_MOVIE_HEIGHT,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
            source={{ uri: item.poster }}
          />
        </SharedElement>
        {/* ITEM_RIGHT */}
        {itemRight === 0 ? (
          <View_Item_Right />
        ) : (
          <Image
            style={styles.imageRight}
            source={{ uri: itemRight.poster }}
            blurRadius={2}
          />
        )}
      </View>

      <View
        style={{
          position: "absolute",
          top: HEIGHT_VIEW_TOP_CONNER - Difference_Height,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width,
            height: height - HEIGHT_VIEW_TOP_CONNER + Difference_Height,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        ></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageCenter: {
    width: ITEM_MAIN_MOVIE_WIDTH,
    height: ITEM_MAIN_MOVIE_HEIGHT,
    position: "absolute",
    top: HEIGHT_VIEW_TOP_CONNER - ITEM_MAIN_MOVIE_HEIGHT,
    left: MarginCenter,
    zIndex: 10,
  },
  imageLeft: {
    width: ITEM_SUB_MOVIE_WIDTH,
    height: ITEM_SUB_MOVIE_HEIGHT,
    position: "absolute",
    top: HEIGHT_VIEW_TOP_CONNER - ITEM_SUB_MOVIE_HEIGHT,
    zIndex: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageRight: {
    width: ITEM_SUB_MOVIE_WIDTH,
    height: ITEM_SUB_MOVIE_HEIGHT,
    position: "absolute",
    top: HEIGHT_VIEW_TOP_CONNER - ITEM_SUB_MOVIE_HEIGHT,
    right: 0,
    zIndex: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default DetailMovie;
