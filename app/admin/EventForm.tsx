'use client'
import { useEffect, useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    DatePicker,
    Switch,
    NumberInput,
} from '@heroui/react'
import {
    getLocalTimeZone,
    now,
    parseAbsolute,
    ZonedDateTime,
} from '@internationalized/date'

import { errorToast, Event } from '@/components/primitives'
interface Props {
    addEvent: (event: Event) => void
    isOpen: boolean
    onOpenChange: () => void
    existingEvent?: Event | null
    clearExisting: () => void
}

export default function EventForm({
    addEvent,
    isOpen,
    onOpenChange,
    existingEvent,
    clearExisting,
}: Props) {
    const [name, setName] = useState('')
    const [nameTouched, setNameTouched] = useState(false)

    const [description, setDescription] = useState('')
    const [descriptionTouched, setDescriptionTouched] = useState(false)

    const [date, setDate] = useState<ZonedDateTime>(now(getLocalTimeZone()))

    const [location, setLocation] = useState('')
    const [locationTouched, setLocationTouched] = useState(false)

    const [isActive, setIsActive] = useState(true)
    const [totalScore, setTotalScore] = useState<number | undefined>(undefined)

    const isEditing = !!existingEvent

    useEffect(() => {
        if (existingEvent) {
            setName(existingEvent.name)
            setDescription(existingEvent.description)
            setDate(parseAbsolute(existingEvent.date, getLocalTimeZone()))
            setLocation(existingEvent.location)
            setIsActive(existingEvent.active)
            setTotalScore(
                existingEvent.totalScore ? existingEvent.totalScore : undefined
            )
        } else {
            setName('')
            setDescription('')
            setDate(now(getLocalTimeZone()))
            setLocation('')
            setIsActive(true)
            setTotalScore(undefined)
        }
    }, [existingEvent])

    const isNameInvalid = name === '' && nameTouched
    const isDescriptionInvalid = description === '' && descriptionTouched
    const isLocationInvalid = location === '' && locationTouched
    const isTotalScoreInvalid = totalScore !== undefined && totalScore <= 0

    const isSubmitDisabled =
        isDescriptionInvalid ||
        isNameInvalid ||
        isLocationInvalid ||
        isTotalScoreInvalid

    async function handleSubmit(onClose: () => void) {
        if (!isEditing) {
            try {
                const res = await fetch('/api/event/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        date: date.toDate().toISOString(),
                        location: location,
                        active: isActive,
                        totalScore: totalScore,
                    }),
                })

                if (!res.ok) throw new Error('Failed to create Event')
                const newEvent = await res.json()

                addEvent(newEvent)
                onClose()
            } catch {
                errorToast()
            }
        } else {
            try {
                const res = await fetch(`/api/event/${existingEvent.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        date: date.toDate().toISOString(),
                        location: location,
                        active: isActive,
                        totalScore: totalScore,
                    }),
                })

                if (!res.ok) throw new Error('Failed to update Event')
                const data = await res.json()
                const updatedEvent = data.event

                addEvent(updatedEvent)
                onClose()
            } catch {
                errorToast()
            }
        }
    }
    function clearData() {
        setName('')
        setDescription('')
        setDate(now(getLocalTimeZone()))
        setLocation('')
        setIsActive(true)
        setTotalScore(undefined)
        setNameTouched(false)
        setDescriptionTouched(false)
        setLocationTouched(false)
        clearExisting()
    }

    return (
        <Modal
            isOpen={isOpen}
            placement="center"
            onClose={() => {
                clearData()
            }}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {isEditing
                                ? `Edit ${existingEvent.name} Details`
                                : 'Create New Event'}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                isRequired
                                color={isNameInvalid ? 'danger' : 'default'}
                                errorMessage={
                                    isNameInvalid ? 'You must enter a name' : ''
                                }
                                isInvalid={isNameInvalid}
                                label="Event Name"
                                value={name}
                                variant="bordered"
                                onFocusChange={(isFocused: boolean) => {
                                    !isFocused && setNameTouched(true)
                                }}
                                onValueChange={setName}
                            />
                            <Textarea
                                isRequired
                                color={
                                    isDescriptionInvalid ? 'danger' : 'default'
                                }
                                errorMessage={
                                    isDescriptionInvalid
                                        ? 'You must enter a description'
                                        : ''
                                }
                                isInvalid={isDescriptionInvalid}
                                label="Event Description"
                                value={description}
                                variant="bordered"
                                onFocusChange={(isFocused: boolean) => {
                                    !isFocused && setDescriptionTouched(true)
                                }}
                                onValueChange={setDescription}
                            />
                            <DatePicker
                                isRequired
                                showMonthAndYearPickers
                                defaultValue={now(getLocalTimeZone())}
                                granularity="minute"
                                label="Event Date & Time"
                                value={date}
                                variant="bordered"
                                onChange={(value) => {
                                    if (value !== null) {
                                        setDate(value)
                                    }
                                }}
                            />
                            <Input
                                isRequired
                                color={isLocationInvalid ? 'danger' : 'default'}
                                errorMessage={
                                    isLocationInvalid
                                        ? 'You must enter a location'
                                        : ''
                                }
                                isInvalid={isLocationInvalid}
                                label="Location"
                                value={location}
                                variant="bordered"
                                onFocusChange={(isFocused: boolean) => {
                                    !isFocused && setLocationTouched(true)
                                }}
                                onValueChange={setLocation}
                            />
                            <div className="flex flex-row gap-4 items-center">
                                <Switch
                                    defaultSelected
                                    isSelected={isActive}
                                    size="md"
                                    onValueChange={setIsActive}
                                >
                                    Active
                                </Switch>
                                <p className="text-small text-default-500">
                                    Users will {isActive ? '' : 'NOT '}be able
                                    to register for{' '}
                                    {!name ? 'this event' : name}{' '}
                                    {!isActive
                                        ? ' but will be able to see their scores'
                                        : ''}
                                </p>
                            </div>
                            <NumberInput
                                isClearable
                                color={
                                    isTotalScoreInvalid ? 'danger' : 'default'
                                }
                                description="Leave blank if unknown/not applicable"
                                errorMessage={
                                    isTotalScoreInvalid
                                        ? 'total score must be greater than 0'
                                        : ''
                                }
                                isInvalid={isTotalScoreInvalid}
                                label="Total Score"
                                minValue={0}
                                value={totalScore}
                                variant="bordered"
                                onValueChange={setTotalScore}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="ghost"
                                onPress={() => {
                                    onClose()
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                isDisabled={isSubmitDisabled}
                                variant={isSubmitDisabled ? 'faded' : 'solid'}
                                onPress={() => {
                                    if (name === '' || description === '') {
                                        setDescriptionTouched(true)
                                        setNameTouched(true)
                                        setLocationTouched(true)
                                    } else {
                                        handleSubmit(onClose)
                                    }
                                }}
                            >
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
