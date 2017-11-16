import { PermissionsAndroid } from 'react-native'
import AsyncStorage, { ASYNC_STORAGE_KEYS } from './util/async-storage'
import RESULT from './util/results'

const _PermissionsAndroid = {

    PERMISSIONS: PermissionsAndroid.PERMISSIONS,

    async request(permission) {
        const status = await this.check(permission)

        if (status === RESULT.GRANTED) {
            return RESULT.GRANTED
        }

        if (status === RESULT.DENIED) {
            return RESULT.DENIED
        }

        const response = await PermissionsAndroid.request(permission)

        await AsyncStorage.setItem(
            `${ASYNC_STORAGE_KEYS.LOCATION_PERMISSION_NEVER_ASK_AGAIN}-${permission}`,
            response === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN,
        )

        switch (response) {
            case PermissionsAndroid.RESULTS.GRANTED:
                return RESULT.GRANTED
            case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
                return RESULT.DENIED
            default:
                return RESULT.UNDEFINED
        }
    },

    async check(permission) {

        const haveClickedNeverAskAgain = await AsyncStorage.getItem(
            `${ASYNC_STORAGE_KEYS.LOCATION_PERMISSION_NEVER_ASK_AGAIN}-${permission}`,
            false
        )

        const status = await PermissionsAndroid.check(permission)

        if (status) {
            await AsyncStorage.setItem(
                `${ASYNC_STORAGE_KEYS.LOCATION_PERMISSION_NEVER_ASK_AGAIN}-${permission}`,
                false,
            )

            return RESULT.GRANTED
        }

        if (haveClickedNeverAskAgain) {
            return RESULT.DENIED
        }

        return RESULT.UNDEFINED
    },
}

export default _PermissionsAndroid
