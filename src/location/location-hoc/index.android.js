import React from 'react'
import { AppState } from 'react-native'
import { Permissions } from '../../common/location'
import hoistNonReactStatic from 'hoist-non-react-statics'

const LocationHoc = (WrappedComponent) => {
    /**
     * A higher order component that will pass 'locationPermission' and 'requestLocationPermission'
     * prop down to it's children
     */
    class WithLocationPermission extends React.PureComponent {

        state = {
            permission: Permissions.RESULTS.UNDEFINED,
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
                    locationPermission={ permission }
                    requestLocationPermission={ this._requestPermission }
                    { ...this.props }
                />
            )
        }
    }

    hoistNonReactStatic(WithLocationPermission, WrappedComponent)

    WithLocationPermission.displayName = `WithLocationPermission(${getDisplayName(WrappedComponent)})`

    return WithLocationPermission
}

export default LocationHoc
