'use client'
import { errorToast } from '@/components/primitives'
import { Autocomplete, AutocompleteItem } from '@heroui/react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
    inputValue: string
    setInputValue: (s: string) => void
    touched: boolean
    setTouched: (t: boolean) => void
    isInvalid: boolean
}

export default function LocationInput({
    inputValue,
    setInputValue,
    touched,
    setTouched,
    isInvalid,
}: Props) {
    const [items, setItems] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const debounceTime = 300
    const debounceTimerRef = useRef<number | null>(null)

    const handleInputChange = useCallback((value: string) => {
        setInputValue(value)

        if (debounceTimerRef.current) {
            window.clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = window.setTimeout(() => {
            if (!value.trim()) {
                setItems([])
                return
            }

            setIsLoading(true)
            fetch(`/api/locations/search?q=${encodeURIComponent(value)}`)
                .then((res) => res.json())
                .then((results: string[]) => {
                    setItems(results)
                    setIsLoading(false)
                })
                .catch((err) => {
                    console.error('Error fetching items:', err)
                    errorToast(
                        'Error searching locations. Please try again later.'
                    )
                    setItems([])
                    setIsLoading(false)
                })
        }, debounceTime)
    }, [])

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                window.clearTimeout(debounceTimerRef.current)
            }
        }
    }, [])

    return (
        <Autocomplete<String>
            label="Location"
            allowsCustomValue={true}
            isRequired
            errorMessage={isInvalid ? 'You must enter a location' : ''}
            variant="bordered"
            items={items}
            inputValue={inputValue}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onValueChange={handleInputChange}
            // validate={(value) => {
            //     const ok = !!value
            //     setIsValid(ok)
            //     return ok || 'You must enter a location'
            // }}
            isInvalid={isInvalid}
            color={isInvalid ? 'danger' : 'default'}
            onFocusChange={(isFocused: boolean) => {
                !isFocused && setTouched(true)
            }}
        >
            {items.map((value, index) => (
                <AutocompleteItem key={value || index} aria-label={value}>
                    {value}
                </AutocompleteItem>
            ))}
        </Autocomplete>
    )
}
