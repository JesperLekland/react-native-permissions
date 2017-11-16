import React from 'react'
import { AppState } from 'react-native'
import Permissions from '../permission'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { getDisplayName } from '../../util'
import RESULT from '../../util/results'

const LocationHoc = (WrappedComponent) => {

    /**
     * A higher order component that will pass 'locationPermission' and 'requestLocationPermission'
     * prop down to it's children
     */
    class WithLocationPermission extends React.PureComponent {

        resolveOngoingRequest

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

                if (permission === RESULT.GRANTED) {
                    this.resolveOngoingRequest && this.resolveOngoingRequest(permission)
                }

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
            const { permission } = this.state

            return new Promise((resolve) => {
                this.resolveOngoingRequest = resolve

                if (permission === RESULT.UNDEFINED) {
                    Permissions.request()
                } else if (permission === RESULT.DENIED) {
                    Permissions.openSettings()
                }
            })
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

