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
import { useCallback, Key } from 'react'
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
        (registration: Registration, columnKey: Key) => {
            const cellValue = registration[columnKey as keyof Registration]

            switch (columnKey) {
                case 'grade':
                    return cellValue === 0 ? 'KG' : cellValue
                case 'score':
                    return cellValue != null
                        ? `${cellValue} ${event.totalScore ? `/ ${event.totalScore}` : ''}`
                        : 'Score not available yet'
                default:
                    return cellValue
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
