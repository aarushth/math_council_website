import { addToast } from '@heroui/toast'

export function errorToast(msg?: string) {
    addToast({
        title: msg ? msg : 'An error ocurred. Please try again later.',
        color: 'danger',
        timeout: 4000,
        shouldShowTimeoutProgress: true,
    })
}
export function successToast(msg?: string) {
    addToast({
        title: msg ? msg : 'Changes Saved Successfully.',
        color: 'success',
        timeout: 4000,
        shouldShowTimeoutProgress: true,
    })
}
