import React from 'react'
import { AppState } from 'react-native'
import { Permissions } from './permission'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { getDisplayName } from '../util'
import RESULT from '../util/results'

const LocationHoc = (WrappedComponent) => {

    /**
     * A higher order component that will pass 'locationPermission' and 'requestLocationPermission'
     * prop down to it's children
     */
    class LocationHocComponentIOS extends React.PureComponent {

        state = {
            permission: RESULT.UNDEFINED,
        }

        async componentDidMount() {

            AppState.addEventListener('change', this._appStateChanged)
            this._checkPermission()
        }

        async _checkPermission() {
            try {
                const permission = await Permissions.check()
                this.setState({ permission })

            } catch (error) {
                console.warn(error)
            }
        }

        componentWillUnmount() {
            AppState.removeEventListener('change', this._appStateChanged)
        }

        _appStateChanged = async (state) => {
            if (state === 'active') {
                try {
                    this._checkPermission()
                } catch (error) {
                    console.warn('appStateChanged', error)
                }
            }
        }

        _requestPermission = async () => {
            const permission = await Permissions.request()
            this.setState({ permission })
            return permission
        }

        render() {

            const { permission } = this.state

            return (
                <WrappedComponent
                    notificationPermission={ permission }
                    requestNotificationPermission={ this._requestPermission }
                    { ...this.props }
                />
            )
        }
    }

    hoistNonReactStatic(LocationHocComponentIOS, WrappedComponent)

    LocationHocComponentIOS.displayName = `WithNotificationPermission(${getDisplayName(WrappedComponent)})`

    return LocationHocComponentIOS
}

export default LocationHoc

