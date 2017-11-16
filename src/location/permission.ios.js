import { Linking } from 'react-native'
import AsyncStorage, { ASYNC_STORAGE_KEYS } from '../../AsyncStorage'
import Constants from './constants'

const LocationPermissions = {

  ...Constants,

  async request() {
    const permission = await LocationPermissions.check()

    if (permission === Constants.RESULTS.GRANTED) {
      return
    }

    AsyncStorage.setItem(ASYNC_STORAGE_KEYS.HAVE_ASKED_FOR_LOCATION_PERMISSION, true)

    navigator.geolocation.requestAuthorization()
  },

  openSettings() {
    Linking.openURL('app-settings:')
  },

  /**
   * Returns a promise that resolve to either "true", "false" or
   * PERMISSION_UNDEFINED if we haven't asked yet
   */
  async check() {
    const haveAsked = await AsyncStorage.getItem(
      ASYNC_STORAGE_KEYS.HAVE_ASKED_FOR_LOCATION_PERMISSION,
      false,
    )

    if (!haveAsked) {
      return Constants.RESULTS.UNDEFINED
    }

    const permission = await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(true),
        error => resolve(error.code !== error.PERMISSION_DENIED),
        { timeout: 100 }
      )
    })

    return permission ? Constants.RESULTS.GRANTED : Constants.RESULTS.DENIED
  }
}

export default LocationPermissions
