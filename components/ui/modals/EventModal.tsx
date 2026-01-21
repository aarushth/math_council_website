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
    Card,
    CardBody,
    Spinner,
    addToast,
} from '@heroui/react'
import {
    getLocalTimeZone,
    now,
    parseAbsolute,
    ZonedDateTime,
} from '@internationalized/date'
import Dropzone from 'react-dropzone'
import { upload } from '@vercel/blob/client'
import { FaFileUpload } from 'react-icons/fa'
import { FaFileCircleCheck } from 'react-icons/fa6'

import { Event } from '@/lib/primitives'

interface Props {
    addEvent: (event: Event) => void
    isOpen: boolean
    onOpenChange: () => void
    existingEvent?: Event | null
    clearExisting: () => void
}

export default function EventModal({
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

    const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined)
    const [isblobLoading, setIsBlobLoading] = useState(false)

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
            setBlobUrl(
                existingEvent.questionPdf
                    ? existingEvent.questionPdf
                    : undefined
            )
        } else {
            setName('')
            setDescription('')
            setDate(now(getLocalTimeZone()))
            setLocation('')
            setIsActive(true)
            setTotalScore(undefined)
            setBlobUrl(undefined)
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
                        name: name.trim(),
                        description: description.trim(),
                        date: date.toDate().toISOString(),
                        location: location.trim(),
                        active: isActive,
                        totalScore: totalScore,
                        questionPdf: blobUrl ? blobUrl : null,
                    }),
                })

                if (!res.ok) throw new Error('Failed to create Event')
                const newEvent = await res.json()

                addEvent(newEvent)
                onClose()
            } catch {
                addToast({ title: 'An error ocurred. Please try again later.' })
            }
        } else {
            try {
                const res = await fetch(`/api/event/${existingEvent.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name.trim(),
                        description: description.trim(),
                        date: date.toDate().toISOString(),
                        location: location.trim(),
                        active: isActive,
                        totalScore: totalScore,
                        questionPdf: blobUrl ? blobUrl : null,
                    }),
                })

                if (!res.ok) throw new Error('Failed to update Event')
                const data = await res.json()
                const updatedEvent = data.event

                addEvent(updatedEvent)
                onClose()
            } catch {
                addToast({ title: 'An error ocurred. Please try again later.' })
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
        setBlobUrl(undefined)
        clearExisting()
    }
    async function uploadPDF(files: File[]) {
        const file = files[0]

        if (!file) return
        setIsBlobLoading(true)
        try {
            const newBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/blob/upload',
            })

            setBlobUrl(newBlob.url)
            setIsBlobLoading(false)
        } catch {
            addToast({ title: 'An error ocurred. Please try again later.' })
        }
        setIsBlobLoading(false)
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
                                className="mb-4"
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
                                className="mb-4"
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
                                className="mb-4"
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
                            <Dropzone
                                accept={{
                                    'application/pdf': ['.pdf'],
                                }}
                                multiple={false}
                                onDrop={(acceptedFiles) =>
                                    uploadPDF(acceptedFiles)
                                }
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <Card className="p-3">
                                        <CardBody
                                            className={`border-2 border-dashed rounded-lg ${
                                                blobUrl !== undefined
                                                    ? 'border-green-500'
                                                    : 'border-black/60 dark:border-white/60'
                                            }`}
                                        >
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <div className="flex flex-col items-center p-3">
                                                    {blobUrl !== undefined ? (
                                                        <>
                                                            <FaFileCircleCheck
                                                                className="text-green-500"
                                                                size={30}
                                                            />
                                                            <p className="text-sm mt-3 text-green-500">
                                                                File Uploaded
                                                                Successfully
                                                            </p>
                                                        </>
                                                    ) : isblobLoading ? (
                                                        <Spinner />
                                                    ) : (
                                                        <>
                                                            <FaFileUpload
                                                                size={30}
                                                            />
                                                            <p className="text-sm mt-3">
                                                                Upload Question
                                                                & Solutions PDF
                                                            </p>
                                                            <p className="text-xs text-black/80 dark:text-white/80 mt-2">
                                                                Accepted File
                                                                Types: .pdf
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                )}
                            </Dropzone>
                            {blobUrl !== undefined && (
                                <Button
                                    className="mb-4"
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        setBlobUrl(undefined)
                                    }}
                                >
                                    Delete Current Question & Solution PDF
                                </Button>
                            )}
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
                                isDisabled={isSubmitDisabled || isblobLoading}
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
