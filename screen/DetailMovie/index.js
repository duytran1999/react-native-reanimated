import React, { useEffect, useRef, useState } from "react";
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
  Easing,
  ScrollView,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import Genres from "../MovieCarouselUpdated/genre";
import Rating from "../MovieCarouselUpdated/rating";

import { getCastOfMovie } from ".././MovieCarouselUpdated/api";

const { width, height } = Dimensions.get("window");

const ITEM_SIZE = width * 0.65;

const ITEM_SUB_MOVIE_WIDTH = width / 3.2;
const ITEM_SUB_MOVIE_HEIGHT = ITEM_SUB_MOVIE_WIDTH * 1.2;

const HEIGHT_VIEW_TOP_CONNER = height * 0.36;

const ITEM_MAIN_MOVIE_WIDTH = width / 2.2;
const ITEM_MAIN_MOVIE_HEIGHT = ITEM_MAIN_MOVIE_WIDTH * 1.2;
const MarginCenter = width / 2 - ITEM_MAIN_MOVIE_WIDTH / 2;

const Difference_Height = 40;

const ITEM_CAST_SIZE = width / 3;

const View_Item_Left = () => {
  return <View style={[styles.imageLeft, { backgroundColor: "black" }]} />;
};

const View_Item_Right = () => {
  return <View style={[styles.imageRight, { backgroundColor: "black" }]} />;
};

const ButtonWatchMovie = () => {
  return (
    <SharedElement
      id={`btnWatchMovie`}
      style={{
        position: "absolute",
        bottom: 10,
        left: width / 2 - (width - 40) / 2,
        zIndex: 9999,
        width: width - 40,
        height: 60,
      }}
    >
      <TouchableOpacity
        style={{
          width: width - 40,
          height: 60,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "900" }}>Watch Now</Text>
      </TouchableOpacity>
    </SharedElement>
  );
};

const DetailMovie = ({ navigation, route }) => {
  const { item, itemLeft, itemRight } = route.params;
  const translateY_ImageMain = useRef(new Animated.Value(700)).current;
  const translateY_ImageLeft = useRef(new Animated.Value(700)).current;
  const translateY_ImageRight = useRef(new Animated.Value(700)).current;
  const translateY_Cast_Item = useRef(new Animated.Value(0)).current;
  const [casts, setCasts] = useState([]);

  console.log(item.key);
  const timing = (destination, value, timing) => {
    return Animated.timing(destination, {
      toValue: value,
      duration: timing,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });
  };

  useEffect(() => {
    const ani1 = timing(translateY_ImageMain, -10, 700);
    const ani2 = timing(translateY_ImageLeft, 0, 800);
    const ani3 = timing(translateY_ImageRight, 0, 1000);
    const ani4= timing(translateY_Cast_Item, 100, 1000);
    

    Animated.parallel([ani1, ani2, ani3, ani4]).start();

    const { item } = route.params;
    const fetchData = async () => {
      const list_cast = await getCastOfMovie(item.key);
      setCasts(list_cast);
    };
    if (casts.length === 0) {
      fetchData();
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#1e272e" }}>
      {/* HEADER */}
      <View
        style={{ backgroundColor: "#1e272e", height: HEIGHT_VIEW_TOP_CONNER }}
      >
        {/* ITEM_LEFT */}
        {itemLeft === 0 ? (
          <View_Item_Left />
        ) : (
          <Animated.Image
            style={[
              styles.imageLeft,
              { transform: [{ translateY: translateY_ImageLeft }] },
            ]}
            source={{ uri: itemLeft.poster }}
            blurRadius={2}
          />
        )}
        {/* ITEM_CENTER */}
        <Animated.Image
          style={[
            styles.imageCenter,
            { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
            { transform: [{ translateY: translateY_ImageMain }] },
          ]}
          source={{ uri: item.poster }}
        />
        {/* ITEM_RIGHT */}
        {itemRight === 0 ? (
          <View_Item_Right />
        ) : (
          <Animated.Image
            style={[
              styles.imageRight,
              { transform: [{ translateY: translateY_ImageRight }] },
            ]}
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
        <SharedElement id={`item.${item.key}.viewInfo`}>
          <View
            style={{
              backgroundColor: "white",
              width,
              height: height - HEIGHT_VIEW_TOP_CONNER + Difference_Height,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          />
        </SharedElement>
        <View
          style={{
            position: "absolute",
            height: 100,
            width,
            padding: 20,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <SharedElement id={`item.${item.key}.title`}>
              <Text
                style={{ fontSize: 24, fontWeight: "700" }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </SharedElement>
            <SharedElement id={`item.${item.key}.genre`}>
              <Genres genre={item.genre} />
            </SharedElement>
            <SharedElement id={`item.${item.key}.rating`}>
              <Rating rating={item.rating} />
            </SharedElement>
          </View>
          <View style={{ marginTop: 20, height: 400 }}>
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              <Text style={{ fontWeight: "600", fontSize: 22 }}>Actors</Text>
              {casts.length == 0 ? (
                <View>
                  <Text>Loading</Text>
                </View>
              ) : (
                <FlatList
                  data={casts}
                  horizontal
                  keyExtractor={(item) => item.key.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                    const translateY_Cast = translateY_Cast_Item.interpolate({
                      inputRange: [0, 100],
                      outputRange: [(index*10) * 100, 0],
                    });
                    return (
                      <Animated.View
                        key={index}
                        style={{
                          paddingRight: 10,
                          marginTop: 10,
                          alignItems: "center",
                          width: ITEM_CAST_SIZE + 10,
                          transform: [{ translateY:translateY_Cast}],
                        }}
                      >
                        <Image
                          source={{ uri: item.img_profile_path }}
                          style={{
                            width: ITEM_CAST_SIZE,
                            height: ITEM_CAST_SIZE,
                            borderRadius: 10,
                          }}
                        />
                        <View style={{ marginTop: 10 }}>
                          <Text style={{ fontWeight: "500" }}>{item.name}</Text>
                        </View>
                      </Animated.View>
                    );
                  }}
                />
              )}
              <View>
                <Text style={{ fontWeight: "600", fontSize: 22 }}>
                  Overview
                </Text>
                <Text>{item.description}</Text>
              </View>
              <View style={{ height: 200 }} />
            </ScrollView>
          </View>
        </View>
      </View>
      <ButtonWatchMovie item={1} />
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
