'use client'
import { errorToast, Event, Registration } from '@/components/primitives'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Select,
    SelectItem,
    Input,
} from '@heroui/react'
import type { Selection } from '@heroui/react'
interface Props {
    event: Event | null
    addRegistration: (eventId: number, r: Registration) => void
    updateRegistration: (eventId: number, r: Registration) => void
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

export default function RegistrationForm({
    event,
    addRegistration,
    updateRegistration,
    isOpen,
    onOpenChange,
    existingRegistration,
    clearExisting,
}: Props) {
    const { data: session } = useSession()
    const [name, setName] = useState('')
    const [nameTouched, setNameTouched] = useState(false)

    const [grade, setGrade] = useState<Selection>(new Set([]))
    const [gradeTouched, setGradeTouched] = useState(false)

    const isEditing = !!existingRegistration

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
        errorToast()
        return
    }
    const isNameInvalid = name === '' && nameTouched

    const gradeNumber = Number(Array.from(grade)[0]) // fastest way
    const isGradeInvalid = Number.isNaN(gradeNumber) && gradeTouched
    const isSubmitDisabled = isGradeInvalid || isNameInvalid
    async function handleSubmit(onClose: () => void) {
        if (!isEditing) {
            try {
                const res = await fetch('/api/registration/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentName: name,
                        grade: gradeNumber,
                        userId: session?.user.id,
                        eventId: event!.id,
                    }),
                })

                if (!res.ok) throw new Error('Failed to create registration')
                const newRegistration = await res.json()
                addRegistration(event!.id, newRegistration)
                onClose()
            } catch (err) {
                console.error(err)
                errorToast()
            }
        } else {
            try {
                const res = await fetch(
                    `/api/registration/${existingRegistration.id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            studentName: name,
                            grade: gradeNumber,
                        }),
                    }
                )

                if (!res.ok) throw new Error('Failed to update registration')
                const data = await res.json()
                const updatedRegistration = data.registration
                updateRegistration(event!.id, updatedRegistration)
                onClose()
            } catch (err) {
                console.error(err)
                errorToast()
            }
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
            onOpenChange={onOpenChange}
            onClose={() => {
                clearData()
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Register for {event!.name}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label="Student Full Name"
                                variant="bordered"
                                value={name}
                                isRequired
                                color={isNameInvalid ? 'danger' : 'default'}
                                errorMessage={
                                    isNameInvalid ? 'You must enter a name' : ''
                                }
                                isInvalid={isNameInvalid}
                                onValueChange={setName}
                                onFocusChange={(isFocused: boolean) => {
                                    !isFocused && setNameTouched(true)
                                }}
                            />
                            <Select
                                className="max-w-xl"
                                variant="bordered"
                                items={grades}
                                label="Grade Level"
                                isRequired
                                errorMessage={
                                    isGradeInvalid
                                        ? 'You must pick a grade'
                                        : ''
                                }
                                isInvalid={isGradeInvalid}
                                selectedKeys={grade}
                                onClose={() => setGradeTouched(true)}
                                onSelectionChange={setGrade}
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
                                variant={isSubmitDisabled ? 'faded' : 'solid'}
                                isDisabled={isSubmitDisabled}
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
