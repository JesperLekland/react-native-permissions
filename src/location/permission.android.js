import { PermissionsAndroid } from 'react-native'
import AsyncStorage, { ASYNC_STORAGE_KEYS } from '../../AsyncStorage'
import RNOpenSettings from 'react-native-open-settings'
import Constants from './constants'

let ongoingRequest

const LocationPermissions = {

  ...Constants,

  async request() {

    const permission = await
      LocationPermissions.check()

    if (permission === Constants.RESULTS.GRANTED) {
      return
    }

    if (permission === Constants.RESULTS.DENIED) {
      return RNOpenSettings.openSettings()
    }

    const response = await
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      )

    await
      AsyncStorage.setItem(
        ASYNC_STORAGE_KEYS.LOCATION_PERMISSION_NEVER_ASK_AGAIN,
        response === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
      )

    switch (response) {
      case PermissionsAndroid.RESULTS.GRANTED:
        return Constants.RESULTS.GRANTED
      case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
        return Constants.RESULTS.DENIED
      default:
        return Constants.RESULTS.UNDEFINED
    }
  },

  /**
   * Returns a promise that resolve to either "true" or "false"
   */
  async check() {
    const haveClickedNeverAskAgain = await AsyncStorage.getItem(
      ASYNC_STORAGE_KEYS.LOCATION_PERMISSION_NEVER_ASK_AGAIN,
      false
    )

    const permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)

    if (permission) {
      return Constants.RESULTS.GRANTED
    }

    if (haveClickedNeverAskAgain) {
      return Constants.RESULTS.DENIED
    }

    return Constants.RESULTS.UNDEFINED
  },
}

export default LocationPermissions
