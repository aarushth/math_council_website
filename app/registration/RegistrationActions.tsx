import { useState } from 'react'
import {
    addToast,
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@heroui/react'
import { MdDelete, MdEdit } from 'react-icons/md'

import { Registration, Event } from '@/lib/primitives'

export default function RegistrationActionsCell({
    registration,
    event,
    deleteRegistration,
    editRegistration,
}: {
    registration: Registration
    event: Event
    deleteRegistration: (id: number) => void
    editRegistration: (registration: Registration) => void
}) {
    const [isOpen, setIsOpen] = useState(false)
    const iconSize = 20

    return (
        <div className="relative flex justify-center items-center gap-3">
            <Button
                className="gap-0 min-w-0 px-2"
                color="default"
                variant="light"
                onPress={() => {
                    editRegistration(registration)
                }}
            >
                <MdEdit size={iconSize} />
            </Button>

            <Popover
                backdrop="opaque"
                color="default"
                isOpen={isOpen}
                onOpenChange={setIsOpen}
            >
                <PopoverTrigger>
                    <Button
                        className="gap-0 min-w-0 px-2"
                        color="danger"
                        variant="light"
                    >
                        <MdDelete size={iconSize} />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="flex flex-col gap-4 p-4">
                    <p className="max-w-xs text-center">
                        Are you sure you want to cancel{' '}
                        {registration.studentName}&apos;s registration for{' '}
                        {event.name}?
                    </p>

                    <Button
                        color="danger"
                        variant="solid"
                        onPress={() => {
                            deleteRegistration(registration.id)
                            setIsOpen(false)
                        }}
                    >
                        Yes, Cancel
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    )
}
