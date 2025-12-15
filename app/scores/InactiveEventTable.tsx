'use client'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from '@heroui/react'
import { Event, Registration } from '@/components/primitives'
import { useCallback, Key, ReactNode } from 'react'
import EventTopContent from '@/components/EventTopContent'

interface Props {
    event: Event
}

export default function InactiveEventTable({ event }: Props) {
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
            key: 'score',
            label: 'Score',
        },
    ]
    const renderCell = useCallback(
        (registration: Registration, columnKey: Key): ReactNode => {
            switch (columnKey) {
                case 'studentName':
                    return registration.studentName
                case 'grade':
                    return registration.grade === 0 ? 'KG' : registration.grade
                case 'score':
                    return registration.score != null
                        ? `${registration.score} ${event.totalScore ? `/ ${event.totalScore}` : ''}`
                        : 'Score not available yet'
                default:
                    return null
            }
        },
        []
    )

    return (
        <Table
            className="mb-5"
            aria-label={event.name + ' scores table'}
            topContent={<EventTopContent event={event} />}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
            </TableHeader>
            <TableBody items={event.registrations || []}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
