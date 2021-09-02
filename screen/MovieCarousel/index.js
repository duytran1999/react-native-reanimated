
import * as React from 'react';
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
} from 'react-native';
import Constants from 'expo-constants';
const { width, height } = Dimensions.get('window');
import { getMovies } from './api';

import MaskedView from '@react-native-community/masked-view';
import Svg, { Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import Genres from './genre';
import Rating from './rating';

const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Loading = () => (
    <View style={styles.loadingContainer}>
        <Text style={styles.paragraph}>Loading...</Text>
    </View>
);
const BackDrop = ({ movies, scrollX }) => {
    return (
        <View style={{ position: 'absolute', width, height: BACKDROP_HEIGHT, backgroundColor: 'red' }}>
            <FlatList
                data={movies}
                keyExtractor={(item) => item.key}
                renderItem={({ item, index }) => {
                    if (!item.backdrop) return null;
                    const inputRange = [
                        (index - 2) * ITEM_SIZE,
                        (index - 1) * ITEM_SIZE
                    ]
                    const outputRange = [
                        -width, 0
                    ]
                    const translateX = scrollX.interpolate({
                        inputRange, outputRange
                    })
                    return (
                        <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }} renderToHardwareTextureAndroid>
                            <FlatList
                                data={movies.reverse()}
                                keyExtractor={(item) => item.key}
                                removeClippedSubviews={false}
                                renderToHardwareTextureAndroid
                                contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
                                renderItem={({ item, index }) => {
                                    if (!item.backdrop) {
                                        return null;
                                    }
                                    const translateX = scrollX.interpolate({
                                        inputRange: [
                                            (index - 2) * ITEM_SIZE,
                                            (index - 1) * ITEM_SIZE
                                        ],
                                        outputRange: [-width, 0],
                                    });
                                    console.log(item.backdrop)
                                    console.log("================================================")
                                    return (
                                        <Animated.View style={{
                                            width,
                                            height,
                                            position: 'absolute',
                                            transform: [{ translateX }]
                                        }}>
                                            <Image
                                                source={{ uri: item.backdrop }}
                                                style={{
                                                    width: width,
                                                    height: BACKDROP_HEIGHT,
                                                    resizeMode: 'cover',

                                                }}
                                            />
                                        </Animated.View>
                                        // <MaskedView
                                        //     style={{
                                        //         width,
                                        //         height,
                                        //         position: 'absolute',
                                        //     }}
                                        //     maskElement={
                                        //         (
                                        //             <AnimatedSvg
                                        //                 width={width}
                                        //                 height={height}
                                        //                 style={{
                                        //                     backgroundColor: 'transparent',
                                        //                     transform: [{ translateX }],
                                        //                 }}
                                        //             >
                                        //                 <Rect
                                        //                     x='0'
                                        //                     y='0'
                                        //                     width={width}
                                        //                     height={height}
                                        //                     fill='red'
                                        //                 />
                                        //             </AnimatedSvg>
                                        //         )
                                        //     }
                                        // >
                                        //     <Image
                                        //         source={{ uri: item.backdrop }}
                                        //         style={{
                                        //             width: width,
                                        //             height: BACKDROP_HEIGHT,
                                        //             resizeMode: 'cover',
                                        //         }}
                                        //     />
                                        // </MaskedView>
                                    );
                                }}
                            />
                            <LinearGradient
                                colors={['rgba(0, 0, 0, 0)', 'white']}
                                style={{
                                    height: BACKDROP_HEIGHT,
                                    width,
                                    position: 'absolute',
                                    bottom: 0,
                                }}
                            />
                        </View>
                    )
                }}
            />
        </View>
    )
}
const Carousel = () => {
    const [movies, setMovies] = React.useState([]);
    const scrollX = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
        const fetchData = async () => {
            const movies = await getMovies();
            // Add empty items to create fake space
            // [empty_item, ...movies, empty_item]
            setMovies([{ key: 'empty-left' }, ...movies, { key: 'empty-right' }]);
        };

        if (movies.length === 0) {
            fetchData(movies);
        }
    }, [movies]);

    if (movies.length === 0) {
        return <Loading />;
    }
    return (
        <View style={styles.container}>

            <StatusBar hidden />
            <BackDrop movies={movies} scrollX={scrollX} />
            <Animated.FlatList
                showsHorizontalScrollIndicator={false}
                data={movies}
                keyExtractor={(item) => item.key}
                horizontal
                contentContainerStyle={{ alignItems: 'center' }}
                snapToInterval={ITEM_SIZE}
                decelerationRate={0}
                scrollEventThrottle={16}
                bounces={false}
                onScroll={
                    Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: true }
                    )
                }
                renderItem={({ item, index }) => {
                    if (!item.poster) {
                        return <View style={{ width: EMPTY_ITEM_SIZE }} />;
                    }
                    const inputRange = [
                        (index - 2) * ITEM_SIZE,
                        (index - 1) * ITEM_SIZE,
                        (index) * ITEM_SIZE
                    ]
                    const translateY = scrollX.interpolate({
                        inputRange,
                        outputRange: [0, -50, 0]
                    })
                    return (
                        <View>
                            <View style={{ width: ITEM_SIZE }}>
                                <Animated.View
                                    style={{
                                        marginHorizontal: SPACING,
                                        padding: SPACING * 2,
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        borderRadius: 34,
                                        transform: [{ translateY }]
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.poster }}
                                        style={styles.posterImage}
                                    />
                                    <Text style={{ fontSize: 24 }} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <Rating rating={item.rating} />


                                    <Genres genres={item.genres} />

                                    <Text style={{ fontSize: 12 }} numberOfLines={3}>
                                        {item.description}
                                    </Text>
                                </Animated.View>
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
}

export default Carousel;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    posterImage: {
        width: '100%',
        height: ITEM_SIZE * 1.2,
        resizeMode: 'cover',
        borderRadius: 24,
        margin: 0,
        marginBottom: 10,
    },
});