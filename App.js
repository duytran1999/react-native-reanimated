import React from "react";
//import Slide from "./screen/SlideAnimated/App";
import {Easing} from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import ListMovie from "./screen/MovieCarouselUpdated/index";
import DetailMovie from "./screen/DetailMovie/index";

const Stack = createSharedElementStackNavigator();

const App = ({ navigation }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ListMovie"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="ListMovie" component={ListMovie} />
        <Stack.Screen
          name="DetailMovie"
          component={DetailMovie}
          options={() => ({
            gestureEnabled: true,
            transitionSpec: {
              open: {
                animation: "timing",
                config: { duration: 500, easing: Easing.inOut(Easing.ease) },
              },
              close: {
                animation: "timing",
                config: { duration: 500, easing: Easing.inOut(Easing.ease) },
              },
            },
            cardStyleInterpolator: ({ current: { progress } }) => {
              return {
                cardStyle: {
                  opacity: progress,
                },
              };
            },
            
          })}   
          sharedElements={(route) => {
            const { item } = route.params;
            //console.log(`item.${item.key}.poster`);
            return [
              {
                id: `item.${item.key}.viewInfo`,
              },
              {
                id: `item.${item.key}.title`,
              },
              {
                id: `item.${item.key}.genre`,
              },
              {
                id: `item.${item.key}.rating`,
              },
            ];
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
