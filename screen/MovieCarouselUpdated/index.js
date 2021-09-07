import * as React from "react";
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
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");
import { getMovie } from "./api";

import { SharedElement } from "react-navigation-shared-element";
//import Svg, { Rect } from "react-native-svg";
//import { LinearGradient } from "expo-linear-gradient";

import Genres from "./genre";
import Rating from "./rating";
import { initialWindowMetrics } from "react-native-safe-area-context";

const SPACING = 5;
const ITEM_SIZE = width * 0.65;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;
//const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading...</Text>
  </View>
);
const BackDrop = ({ movies, scrollX }) => {
  return (
    <View
      style={{
        position: "absolute",
        width,
        height: BACKDROP_HEIGHT,
        backgroundColor: "#f5f6fa",
      }}
    >
      <FlatList
        data={movies.reverse()}
        keyExtractor={(item) => item.key.toString()}
        contentContainerStyle={{
          width,
          height: BACKDROP_HEIGHT,
        }}
        renderItem={({ index, item }) => {
          const translateX = scrollX.interpolate({
            inputRange: [(index - 1) * ITEM_SIZE, index * ITEM_SIZE],
            outputRange: [0, width],
          });
          return (
            <Animated.View
              key={index}
              style={{ position: "absolute", transform: [{ translateX }] }}
            >
              <Image
                source={{ uri: item.backdrop, width, height }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  resizeMode: "cover",
                  borderWidth: 2,
                }}
              />
            </Animated.View>
          );
        }}
      />
      {/* <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "#f5f6fa"]}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: "absolute",
          bottom: 0,
        }}
      /> */}
    </View>
  );
};
const ButtonWatchMovie = () => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 10,
        zIndex: 9999,
        alignItems: "center",
        width: width,
        height: 60,
      }}
    >
      <TouchableOpacity>
        <View
          style={{
            height: 60,
            width: ITEM_SIZE - 20,
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>Watch Now</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const Carousel = ({ navigation }) => {
  const [movies, setMovies] = React.useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const scaleItem = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovie();
      setMovies([{ key: "empty-left" }, ...movies, { key: "empty-right" }]);
      console.log(movies.length);
    };

    if (movies.length === 0) {
      fetchData(movies);
    }
  }, [movies]);

  if (movies.length === 0) {
    return <Loading />;
  }

  const HandleScaleMovie = (item, index) => {
    const index_movie_center = movies.findIndex(
      (movie) => movie.key === item.key
    );
    navigation.push("DetailMovie", {
      item,
      itemLeft: index_movie_center === 1 ? 0 : movies[index_movie_center - 1],
      itemRight:
        index_movie_center === movies.length - 1
          ? movies[movies.length - 2]
          : movies[index_movie_center + 1],
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <BackDrop movies={movies} scrollX={scrollX} />
      <ButtonWatchMovie />
      <Animated.FlatList
        style={{}}
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(item) => item.key.toString()}
        horizontal
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-end",
          position: "absolute",
          bottom: 20,
        }}
        snapToInterval={ITEM_SIZE}
        decelerationRate={"fast"}
        scrollEventThrottle={16}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          if (!item.poster) {
            return <View style={{ width: EMPTY_ITEM_SIZE }} />;
          }
          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [0, -50, 0],
          });

          return (
            <View>
              <View style={{ width: ITEM_SIZE }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    HandleScaleMovie(item, index);
                  }}
                >
                  <Animated.View
                    style={{
                      marginHorizontal: SPACING,
                      padding: SPACING * 2,
                      alignItems: "center",
                      backgroundColor: "white",
                      borderRadius: 34,
                      transform: [{ translateY }],
                    }}
                  >
                    <SharedElement
                      id={`item.${item.key}.poster`}
                      style={styles.posterImage}
                    >
                      <Image
                        source={{ uri: item.poster }}
                        style={styles.posterImage}
                      />
                    </SharedElement>

                    <Text style={{ fontSize: 24 }} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Genres genre={item.genre} />
                    <Rating rating={item.rating} />
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  posterImage: {
    width: "100%",
    height: ITEM_SIZE * 1.2,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});
