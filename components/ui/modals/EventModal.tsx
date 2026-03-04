'use client'
import { useEffect, useState } from 'react'
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
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    addToast,
    Button,
    Card,
    CardBody,
    Input,
    Textarea,
    Spinner,
    Switch,
    DatePicker,
    NumberInput,
    Tabs,
    Tab,
} from '@heroui/react'

import GradeSlider from '../GradeSlider'

import { Event } from '@/lib/primitives'
import {
    useCreateEvent,
    useUpdateEvent,
} from '@/components/hooks/useAdminQueries'

interface Props {
    isOpen: boolean
    onOpenChange: () => void
    existingEvent?: Event | null
    clearExisting: () => void
}

const gradeRanges: Record<string, number[]> = {
    all: [0, 8],
    elementary: [0, 5],
    middle: [6, 8],
}

export default function EventModal({
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

    const [gradeRangeKey, setGradeRangeKey] = useState('all')
    const [customGradeRange, setCustomGradeRange] = useState<number[]>([0, 8])

    const gradeRange =
        gradeRangeKey === 'custom'
            ? customGradeRange
            : gradeRanges[gradeRangeKey]

    const isEditing = !!existingEvent
    const createEventMutation = useCreateEvent()
    const updateEventMutation = useUpdateEvent()

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

            // Determine the grade range key based on minGrade and maxGrade
            const eventRange = [existingEvent.minGrade, existingEvent.maxGrade]
            const matchingKey = Object.entries(gradeRanges).find(
                ([, range]) =>
                    range[0] === eventRange[0] && range[1] === eventRange[1]
            )?.[0]

            if (matchingKey) {
                setGradeRangeKey(matchingKey)
            } else {
                setCustomGradeRange(eventRange)
                setGradeRangeKey('custom')
            }
        } else {
            clearData()
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
        const eventData = {
            name: name.trim(),
            description: description.trim(),
            date: date.toDate().toISOString(),
            location: location.trim(),
            active: isActive,
            totalScore: totalScore,
            minGrade: gradeRange[0],
            maxGrade: gradeRange[1],
            questionPdf: blobUrl ? blobUrl : null,
        }

        if (!isEditing) {
            createEventMutation.mutate(eventData, {
                onSuccess: () => {
                    onClose()
                },
            })
        } else {
            updateEventMutation.mutate(
                { id: existingEvent.id, ...eventData },
                {
                    onSuccess: () => {
                        onClose()
                    },
                }
            )
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
        setGradeRangeKey('all')
        setCustomGradeRange([0, 8])
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
            scrollBehavior="outside"
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
                            <p>Grade Range</p>
                            <Tabs
                                fullWidth
                                aria-label="GradeRange"
                                selectedKey={gradeRangeKey}
                                variant="bordered"
                                onSelectionChange={(key) => {
                                    setGradeRangeKey(key as string)
                                }}
                            >
                                <Tab key="all" title="all" />
                                <Tab key="elementary" title="elementary" />
                                <Tab key="middle" title="middle" />
                                <Tab key="custom" title="custom" />
                            </Tabs>
                            <GradeSlider
                                range={gradeRange}
                                setRange={(range) => {
                                    setCustomGradeRange(range)
                                    setGradeRangeKey('custom')
                                }}
                                title=""
                            />
                            <div className="mt-5 flex flex-row gap-4 items-center">
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
