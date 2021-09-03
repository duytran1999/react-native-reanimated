import React from 'react'
import { View, Text } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

const rating = ({ rating }) => {
    const goodStar = Math.floor(rating / 2)
    const badStar = Array(5 - goodStar).fill("staro");
    const ratingArr = [...Array(goodStar).fill("star"), ...badStar];
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:10}}>
            <View>
                <Text style={{
                    fontWeight: '600',
                    fontSize: 16,
                }}>
                    {rating}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:10 }}>
                {
                    ratingArr.map((item, index) => (
                        <AntDesign
                            key={index}
                            name={item} size={15} color="tomato"
                        />
                    ))
                }
            </View>
        </View>
    )
}

export default rating
