'use client'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from '@heroui/react'
import { errorToast, Event, Registration } from '@/components/primitives'
import { useCallback, Key, useState } from 'react'
import EventTopContent from '@/components/EventTopContent'

interface Props {
    event: Event
    onEditClick: (e: Event) => void
    onDeleteEvent: (id: number) => void
}

export default function AdminEventTable({
    event,
    onEditClick,
    onDeleteEvent,
}: Props) {
    const columns = [
        {
            key: 'studentName',
            label: 'Student Name',
        },
        {
            key: 'grade',
            label: 'Grade',
        },
        {
            key: 'actions',
            label: 'Actions',
        },
    ]
    const renderCell = useCallback(
        (registration: Registration, columnKey: Key) => {
            // const [isOpen, setIsOpen] = useState(false);
            const cellValue = registration[columnKey as keyof Registration]

            switch (columnKey) {
                case 'grade':
                    return cellValue === 0 ? 'KG' : cellValue
                case 'actions':
                    return 'no actions'
                default:
                    return cellValue
            }
        },
        []
    )
    async function deleteEvent(id: number) {
        try {
            const res = await fetch(`/api/event/${id}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error('Failed to cancel event')
            onDeleteEvent(event.id)
        } catch (err) {
            console.error(err)
            errorToast()
        }
    }
    return (
        <Table
            aria-label={event.name + ' admin table'}
            topContent={
                <EventTopContent
                    event={event}
                    editAllowed={true}
                    onEditClick={onEditClick}
                    onDeleteClick={deleteEvent}
                />
            }
            className="mb-5"
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn className="text-center" key={column.key}>
                        {column.label}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                items={event.registrations || []}
                emptyContent={'No registrations found.'}
            >
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell className="text-center">
                                {renderCell(item, columnKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
