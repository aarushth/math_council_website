'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
    addToast,
    Button,
    Input,
    Select,
    SelectItem,
    SharedSelection,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react'

import { Event, Registration } from '@/lib/primitives'
import {
    useCreateRegistration,
    useUpdateRegistration,
} from '@/components/hooks/useRegistrationQueries'

interface Props {
    event: Event | null
    isOpen: boolean
    onOpenChange: () => void
    existingRegistration?: Registration | null
    clearExisting: () => void
}

const grades = [
    { key: '0', label: 'Kindergarten' },
    { key: '1', label: '1st Grade' },
    { key: '2', label: '2nd Grade' },
    { key: '3', label: '3rd Grade' },
    { key: '4', label: '4th Grade' },
    { key: '5', label: '5th Grade' },
    { key: '6', label: '6th Grade' },
    { key: '7', label: '7th Grade' },
    { key: '8', label: '8th Grade' },
]

export default function RegistrationModal({
    event,
    isOpen,
    onOpenChange,
    existingRegistration,
    clearExisting,
}: Props) {
    const { data: session } = useSession()
    const [name, setName] = useState('')
    const [nameTouched, setNameTouched] = useState(false)

    const [grade, setGrade] = useState<SharedSelection>(new Set([]))
    const [gradeTouched, setGradeTouched] = useState(false)

    const isEditing = !!existingRegistration
    const createRegistrationMutation = useCreateRegistration()
    const updateRegistrationMutation = useUpdateRegistration()

    useEffect(() => {
        if (existingRegistration) {
            setName(existingRegistration.studentName)
            setGrade(new Set([String(existingRegistration.grade)])) // store as Set<string>
        } else {
            setName('')
            setGrade(new Set())
        }
    }, [existingRegistration])
    if (isOpen && event == null) {
        addToast({
            title: 'An Error Occured',
            description: 'Please Try Again Later',
        })

        return
    }
    const isNameInvalid = name === '' && nameTouched

    const gradeNumber = Number(Array.from(grade)[0]) // fastest way
    const isGradeInvalid = Number.isNaN(gradeNumber) && gradeTouched
    const isSubmitDisabled = isGradeInvalid || isNameInvalid

    function handleSubmit(onClose: () => void) {
        const registrationData = {
            studentName: name.trim(),
            grade: gradeNumber,
            userId: session!.user.id,
            eventId: event!.id,
        }

        if (!isEditing) {
            createRegistrationMutation.mutate(registrationData, {
                onSuccess: () => {
                    onClose()
                },
            })
        } else {
            updateRegistrationMutation.mutate(
                {
                    id: existingRegistration.id,
                    ...registrationData,
                },
                {
                    onSuccess: () => {
                        onClose()
                    },
                }
            )
        }
    }
    function clearData() {
        setGrade(new Set([]))
        setName('')
        setGradeTouched(false)
        setNameTouched(false)
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
                            Register for {event!.name}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                isRequired
                                color={isNameInvalid ? 'danger' : 'default'}
                                errorMessage={
                                    isNameInvalid ? 'You must enter a name' : ''
                                }
                                isInvalid={isNameInvalid}
                                label="Student Full Name"
                                value={name}
                                variant="bordered"
                                onFocusChange={(isFocused: boolean) => {
                                    !isFocused && setNameTouched(true)
                                }}
                                onValueChange={setName}
                            />
                            <Select
                                isRequired
                                className="max-w-xl"
                                errorMessage={
                                    isGradeInvalid
                                        ? 'You must pick a grade'
                                        : ''
                                }
                                isInvalid={isGradeInvalid}
                                items={grades}
                                label="Grade Level"
                                selectedKeys={grade}
                                variant="bordered"
                                onClose={() => setGradeTouched(true)}
                                onSelectionChange={(g: SharedSelection) => {
                                    setGrade(g)
                                }}
                            >
                                {grades.map((g, i) => (
                                    <SelectItem key={i.toString()}>
                                        {g.label}
                                    </SelectItem>
                                ))}
                            </Select>
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
                                    if (
                                        Number.isNaN(gradeNumber) ||
                                        name === ''
                                    ) {
                                        setGradeTouched(true)
                                        setNameTouched(true)
                                    } else {
                                        handleSubmit(onClose)
                                    }
                                }}
                            >
                                Submit
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
