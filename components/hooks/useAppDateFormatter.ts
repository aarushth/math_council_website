import { useDateFormatter } from '@react-aria/i18n'

export function useAppDateFormatter() {
    return useDateFormatter({
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    })
}
