'use client'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from '@heroui/react'
import { Event, Registration, errorToast } from '@/components/primitives'
import RegistrationActions from './RegistrationActions'
import { useCallback, Key } from 'react'
import EventTopContent from '@/components/EventTopContent'
import { FaPlus } from 'react-icons/fa'

interface Props {
    event: Event
    onRegisterClick: (event: Event, registration?: Registration) => void
    onCancelRegistration: (eventId: number, registrationId: number) => void
}

export default function ActiveEventTable({
    event,
    onRegisterClick,
    onCancelRegistration,
}: Props) {
    async function deleteRegistration(id: number) {
        try {
            const res = await fetch(`/api/registration/${id}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error('Failed to cancel registration')
            onCancelRegistration(event.id, id)
        } catch (err) {
            console.error(err)
            errorToast()
        }
    }
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
            const cellValue = registration[columnKey as keyof Registration]

            switch (columnKey) {
                case 'grade':
                    return cellValue === 0 ? 'KG' : cellValue
                case 'actions':
                    return (
                        <RegistrationActions
                            registration={registration}
                            event={event}
                            deleteRegistration={deleteRegistration}
                            editRegistration={(r) => {
                                onRegisterClick(event, r)
                            }}
                        />
                    )
                default:
                    return cellValue
            }
        },
        []
    )

    return (
        <Table
            className="mb-5"
            aria-label={event.name + ' registration table'}
            topContent={<EventTopContent event={event} />}
            bottomContent={
                <div
                    className="cursor-pointer text-green-500 flex flex-row items-center gap-2 p-2 rounded-xl hover:bg-green-500 hover:text-black"
                    onClick={() => onRegisterClick(event)}
                >
                    <FaPlus className="size-5"></FaPlus>
                    <p>
                        Register a{event.registrations.length != 0 && 'nother'}{' '}
                        student
                    </p>
                </div>
            }
        >
            <TableHeader className="mx-0" columns={columns}>
                {(column) => (
                    <TableColumn className="text-center px-0" key={column.key}>
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
