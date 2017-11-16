import { Linking, Platform, PushNotificationIOS } from 'react-native'
import AsyncStorage, { ASYNC_STORAGE_KEYS } from '../util/async-storage'
import RESULT from '../util/results'

const mapPermissionObjectToResult = (permission, haveAsked) => {
  if (Object.values(permission).every(value => value === 1)) {
    return RESULT.GRANTED
  } else if (haveAsked) {
    return RESULT.DENIED
  }
  return RESULT.UNDEFINED
}

export const Permissions = {

  async check() {
    if (Platform.OS === 'android') {
      return RESULT.GRANTED
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

    if (_permission === RESULT.DENIED) {
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
