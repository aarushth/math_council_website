import { FaCalendar, FaFileAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa'
import { MdDelete, MdEdit } from 'react-icons/md'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    Button,
    Tooltip,
} from '@heroui/react'
import { useState } from 'react'
import { BiSolidPrinter } from 'react-icons/bi'

import { Event, GRADES } from '@/lib/primitives'
import { useAppDateFormatter } from '@/components/hooks/useAppDateFormatter'
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
    onEditClick = () => {},
    onDeleteClick = () => {},
    onPrintClick = () => {},
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    let formatter = useAppDateFormatter()

    return (
        <>
            <div className="flex flex-row justify-between">
                <div className="flex flex-1 flex-col gap-3">
                    <p className="block text-xl">{event.name}</p>
                    <p className="block text-xs -my-2 text-black/80 dark:text-white/80">
                        {event.description}
                    </p>
                </div>
                {editAllowed && (
                    <div
                        className={`grid ${event.questionPdf ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-0 self-start`}
                    >
                        {event.questionPdf && (
                            <Tooltip content="View Question and Answer PDF">
                                <Button
                                    isIconOnly
                                    variant="light"
                                    onPress={() => {
                                        window.open(
                                            event.questionPdf!,
                                            '_blank'
                                        )
                                    }}
                                >
                                    <FaFileAlt size={20} />
                                </Button>
                            </Tooltip>
                        )}

                        <Tooltip content="Edit Event Details">
                            <Button
                                isIconOnly
                                variant="light"
                                onPress={() => onEditClick(event)}
                            >
                                <MdEdit size={20} />
                            </Button>
                        </Tooltip>

                        <Tooltip content="Print Event Registrations">
                            <Button
                                isIconOnly
                                variant="light"
                                onPress={() => onPrintClick()}
                            >
                                <BiSolidPrinter size={20} />
                            </Button>
                        </Tooltip>

                        <Popover
                            backdrop="opaque"
                            color="default"
                            isOpen={isOpen}
                            onOpenChange={setIsOpen}
                        >
                            <PopoverTrigger>
                                <Button
                                    isIconOnly
                                    color="danger"
                                    variant="light"
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
            <div className="flex flex-row gap-4 mt-1 text-black/80 dark:text-white/80">
                <FaCalendar opacity={80} size={15} />
                <p className="text-xs">
                    {formatter.format(new Date(event.date))}
                </p>
            </div>
            <div className="flex flex-row gap-4 text-black/80 dark:text-white/80">
                <FaMapMarkerAlt size={15} />
                <p className="text-xs">{event.location}</p>
            </div>
            <div className="flex flex-row gap-4 text-black/80 dark:text-white/80">
                <FaUsers size={15} />
                <p className="text-xs">
                    {`Grades ${GRADES[event.minGrade]?.label} to ${GRADES[event.maxGrade]?.label}`}
                </p>
            </div>
        </>
    )
}
