import { Linking, Platform, PushNotificationIOS } from 'react-native'
import AsyncStorage, { ASYNC_STORAGE_KEYS } from '../AsyncStorage'

const mapPermissionObjectToResult = (permission, haveAsked) => {
  if (Object.values(permission).every(value => value === 1)) {
    return Permissions.RESULTS.GRANTED
  } else if (haveAsked) {
    return Permissions.RESULTS.DENIED
  }
  return Permissions.RESULTS.UNDEFINED
}

export const Permissions = {

  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    UNDEFINED: 'undefined',
  },

  async check() {
    if (Platform.OS === 'android') {
      return Permissions.RESULTS.GRANTED
    } else {
      const haveAsked  = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.HAVE_ASKED_FOR_NOTIFICATION_PERMISSION,
        false
      )
      const permission = await new Promise(resolve => PushNotificationIOS.checkPermissions(resolve))

      return mapPermissionObjectToResult(permission, haveAsked)
    }
  },

  async request() {
    const _permission = await this.check()

    if (_permission === Permissions.RESULTS.DENIED) {
      return this.openSettings()
    }

    const permission = await PushNotificationIOS.requestPermissions()

    AsyncStorage.setItem(
      ASYNC_STORAGE_KEYS.HAVE_ASKED_FOR_NOTIFICATION_PERMISSION,
      true,
    )

    return mapPermissionObjectToResult(permission, true)
  },

  openSettings() {
    Linking.openURL('app-settings:')
  }
}
