import LocationPermission, { WithLocationPermission } from './location'
import NotificationPermission, { WithNotificationPermission } from './notification'

export const Location = {
    Permission: LocationPermission,
    WithPermission: WithLocationPermission,
}

export const Notification = {
    Permission: NotificationPermission,
    WithPermission: WithNotificationPermission,
}
