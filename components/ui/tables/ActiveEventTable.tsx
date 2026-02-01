'use client'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from '@heroui/react'
import { useCallback, Key, ReactNode } from 'react'
import { FaPlus } from 'react-icons/fa'

import RegistrationActions from '../buttons/RegistrationActions'

import { Event, Registration } from '@/lib/primitives'
import EventTopContent from '@/components/ui/tables/EventTopContent'
import { useDeleteRegistration } from '@/components/hooks/useRegistrationQueries'

interface Props {
    event: Event
    onRegisterClick: (event: Event, registration?: Registration) => void
}

export default function ActiveEventTable({ event, onRegisterClick }: Props) {
    const deleteRegistrationMutation = useDeleteRegistration()

    function deleteRegistration(id: number) {
        deleteRegistrationMutation.mutate({ id, eventId: event.id })
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
        (registration: Registration, columnKey: Key): ReactNode => {
            switch (columnKey) {
                case 'grade':
                    return registration.grade === 0 ? 'KG' : registration.grade
                case 'actions':
                    return (
                        <RegistrationActions
                            deleteRegistration={deleteRegistration}
                            editRegistration={(r) => {
                                onRegisterClick(event, r)
                            }}
                            event={event}
                            registration={registration}
                        />
                    )
                case 'studentName':
                    return registration.studentName
                default:
                    return null
            }
        },
        [event, onRegisterClick]
    )

    return (
        <Table
            aria-label={event.name + ' registration table'}
            bottomContent={
                <Button
                    className="bg-white/0 justify-start cursor-pointer text-primary-300 flex flex-row items-center gap-2 p-2 rounded-xl hover:bg-primary-500 dark:hover:text-black hover:text-white"
                    size="lg"
                    startContent={<FaPlus size={20} />}
                    onPress={() => onRegisterClick(event)}
                >
                    Register a{event.registrations.length != 0 && 'nother'}{' '}
                    student
                </Button>
            }
            className="mb-5"
            topContent={<EventTopContent event={event} />}
        >
            <>
                {event.registrations.length > 0 && (
                    <TableHeader className="mx-0" columns={columns}>
                        {(column) => (
                            <TableColumn
                                key={column.key}
                                className="text-center px-0"
                            >
                                {column.label}
                            </TableColumn>
                        )}
                    </TableHeader>
                )}
            </>
            <TableBody
                emptyContent="No registrations found"
                items={event.registrations || []}
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
