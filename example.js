import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Location } from './src'

class LocationExample extends React.PureComponent {

    state = {
        isLoading: false,
    }

    render() {

        const { test, locationPermission, requestLocationPermission } = this.props
        const { isLoading }                                           = this.state

        return (
            <View style={ styles.container }>
                <Text>
                    { 'havePermission: ' + locationPermission }
                </Text>
                <Text>
                    { test }
                </Text>
                <Button
                    title={ locationPermission === Location.Permission.RESULT.GRANTED ? 'good to go' : 'request permisssion' }
                    style={ { alignSelf: 'center', marginTop: 50 } }
                    onPress={ requestLocationPermission }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 150,
    }
})

export default Location.WithPermission(LocationExample)
