import { AsyncStorage } from 'react-native'

const Storage = {

    _stringify(value) {
        return JSON.stringify(value)
    },

    _parse(string) {
        return JSON.parse(string)
    },

    async getItem(key, defaultValue) {
        try {
            const value = await AsyncStorage.getItem(key)
            if (value) {
                return this._parse(value)
            }
            return defaultValue
        } catch (error) {
            console.warn('error getting item for key', key)
        }
    },

    async setItem(key, value) {
        try {
            return await AsyncStorage.setItem(key, this._stringify(value))
        } catch (error) {
            console.warn(`error setting value "${this._stringify(value)}" for key "${key}"`)
        }
    },

    async removeItem(key) {
        try {
            return await AsyncStorage.removeItem(key)
        } catch (error) {
            console.warn(`error deleting item with key`, key)
        }
    }
}

export const ASYNC_STORAGE_KEYS = {
    LOCATION_PERMISSION_NEVER_ASK_AGAIN: 'LOCATION_PERMISSION_NEVER_ASK_AGAIN',
    HAVE_ASKED_FOR_NOTIFICATION_PERMISSION: 'HAVE_ASKED_FOR_NOTIFICATION_PERMISSION',
    HAVE_ASKED_FOR_LOCATION_PERMISSION: 'HAVE_ASKED_FOR_LOCATION_PERMISSION',
}

export default Storage
