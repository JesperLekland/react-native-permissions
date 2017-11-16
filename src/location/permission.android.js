import PermissionsAndroid from '../permissions-android'

const LocationPermissions = {

    async request() {
        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
    },

    async check() {
        return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
    },
}

export default LocationPermissions
