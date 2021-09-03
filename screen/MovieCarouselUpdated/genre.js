import React from 'react'
import { View, Text } from 'react-native'

const genre = ({ genre }) => {
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            {
                genre.map((item, index) => {
                    return (
                        <View key={index} style={{
                            borderRadius: 10,
                            borderWidth: 2, borderColor: 'silver', marginRight: 5, paddingHorizontal: 6, paddingVertical: 4
                        }}>
                            <Text style={{ fontSize: 9 }}>{item}</Text>
                        </View>
                    )
                })
            }
        </View>
    )
}

export default genre
