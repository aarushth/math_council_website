import { Slider } from '@heroui/react'

import { GRADES } from '@/lib/primitives'
interface Props {
    title: string
    range: number[]
    minValue?: number
    maxValue?: number
    setRange: (r: number[]) => void
}
export default function GradeSlider({
    title,
    range,
    setRange,
    minValue = 0,
    maxValue = 8,
}: Props) {
    const grades = Object.entries(GRADES)
        .filter(([key]) => Number(key) >= minValue && Number(key) <= maxValue)
        .map(([key, { shortLabel }]) => ({
            value: Number(key),
            label: shortLabel,
        }))

    return (
        <Slider
            showSteps
            className="max-w-md"
            getValue={(value) => {
                return Array.isArray(value)
                    ? `${value[0] === 0 ? 'KG' : value[0]}-${value[1]}`
                    : value.toString()
            }}
            label={title}
            marks={grades}
            maxValue={maxValue}
            minValue={minValue}
            step={1}
            value={range}
            onChange={(r) => setRange(r as number[])}
        />
    )
}
