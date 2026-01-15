import { Event } from '@/components/primitives'
import { FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'
import { useDateFormatter } from '@react-aria/i18n'
import { Button } from '@heroui/button'
import { MdDelete, MdEdit } from 'react-icons/md'
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover'
import { useState } from 'react'
import { BiSolidPrinter } from 'react-icons/bi'
interface Props {
    event: Event
    editAllowed?: boolean
    onEditClick?: (e: Event) => void
    onDeleteClick?: (id: number) => void
    onPrintClick?: () => void
}

export default function EventTopContent({
    event,
    editAllowed = false,
    onEditClick = (e: Event) => {},
    onDeleteClick = (id: number) => {},
    onPrintClick = () => {},
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    let formatter = useDateFormatter({
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    })
    return (
        <>
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-3">
                    <p className="block text-xl">{event.name}</p>
                    <p className="block text-xs -my-2 text-body">
                        {event.description}
                    </p>
                </div>
                {editAllowed && (
                    <div className="flex flex-row gap-3">
                        <Button
                            className="gap-0 min-w-0 px-2"
                            variant="light"
                            onPress={() => onEditClick(event)}
                        >
                            <MdEdit size={20} />
                        </Button>
                        <Button
                            className="gap-0 min-w-0 px-2"
                            variant="light"
                            onPress={() => onPrintClick()}
                        >
                            <BiSolidPrinter size={20} />
                        </Button>
                        <Popover
                            color="default"
                            backdrop="opaque"
                            isOpen={isOpen}
                            onOpenChange={setIsOpen}
                        >
                            <PopoverTrigger>
                                <Button
                                    className="gap-0 min-w-0 px-2"
                                    variant="light"
                                    color="danger"
                                >
                                    <MdDelete size={20} />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="flex flex-col gap-4 p-4">
                                <p className="max-w-xs text-center">
                                    Are you sure you want to delete {event.name}
                                    ? All registrations and scores associated
                                    with {event.name} will be lost PERMANENTLY
                                </p>

                                <Button
                                    color="danger"
                                    variant="solid"
                                    onPress={() => {
                                        onDeleteClick(event.id)
                                        setIsOpen(false)
                                    }}
                                >
                                    Yes, Delete {event.name}
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>
            <div className="flex flex-row gap-4 mt-1">
                <FaCalendar className="size-4"></FaCalendar>
                <p className="text-xs font-normal text-body text-center">
                    {formatter.format(new Date(event.date))}
                </p>
            </div>
            <div className="flex flex-row gap-4">
                <FaMapMarkerAlt className="size-4"></FaMapMarkerAlt>
                <p className="text-xs font-normal text-body">
                    {event.location}
                </p>
            </div>
        </>
    )
}
