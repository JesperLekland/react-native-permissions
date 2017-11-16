import LocationPermission, { WithLocationPermission } from './location'
import NotificationPermission, { WithNotificationPermission } from './notification'
import RESULT from './util/results'


export const Location = {
    Permission: {
        ...LocationPermission,
        RESULT,
    },
    WithPermission: WithLocationPermission,
}

export const Notification = {
    Permission: {
        ...NotificationPermission,
        RESULT,
    },
    WithPermission: WithNotificationPermission,
}
