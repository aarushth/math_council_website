'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@heroui/input'
import { useAsyncList } from '@react-stately/data'

interface LocationSearchInputProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
}

export default function LocationInput({
    value: initialValue = '',
    onChange,
    placeholder,
}: LocationSearchInputProps) {
    const [value, setValue] = useState(initialValue)
    const [debouncedValue, setDebouncedValue] = useState(initialValue)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setDebouncedValue(value)
        }, 500)
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [value])

    const list = useAsyncList<string>({
        async load({ signal }) {
            if (!debouncedValue) return { items: [] }

            const res = await fetch(
                `/api/locations/search?q=${encodeURIComponent(debouncedValue)}`,
                { signal }
            )
            const data: string[] = await res.json()
            console.log('Fetched data', data)
            return { items: data }
        },
        getKey: (item) => item,
        key: debouncedValue,
    })

    const handleChange = (val: string) => {
        console.log(val)
        setValue(val)
        if (onChange) onChange(val)
    }

    return (
        <div className="relative w-full">
            <Input
                value={value}
                onValueChange={handleChange}
                placeholder={placeholder || 'Search locations'}
            />
            {list.items.length > 0 && (
                <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto shadow-lg bg-white rounded">
                    {list.items.map((s) => (
                        <div
                            key={s}
                            className="cursor-pointer hover:bg-gray-100 p-2"
                            onClick={() => handleChange(s)}
                        >
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
