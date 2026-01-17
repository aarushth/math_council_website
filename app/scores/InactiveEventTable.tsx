'use client'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    useDisclosure,
} from '@heroui/react'
import { Event, Registration } from '@/components/primitives'
import { useCallback, Key, ReactNode, useState } from 'react'
import EventTopContent from '@/components/EventTopContent'
import { FaClipboardCheck } from 'react-icons/fa'
import ScoreReportModal from './ScoreReportModal'
import { useMediaQuery } from '@/components/useMediaQuery'

interface Props {
    event: Event
}

export default function InactiveEventTable({ event }: Props) {
    const [currentRegistration, setCurrentRegistration] = useState<
        Registration | undefined
    >(undefined)
    const {
        isOpen: isScoreReportOpen,
        onOpen: onScoreReportOpen,
        onOpenChange: onScoreReportOpenChange,
    } = useDisclosure()
    const isDesktop: boolean = useMediaQuery('(min-width: 768px)')
    console.log(isDesktop)
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
        {
            key: 'actions',
            label: isDesktop ? '' : 'Report',
        },
    ].filter((column) => isDesktop || column.key !== 'grade')
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
                        : 'Score Unavailable'
                case 'actions':
                    return (
                        <Button
                            className="gap-3"
                            variant="solid"
                            isDisabled={
                                registration.score != null ? false : true
                            }
                            isIconOnly={!isDesktop}
                            onPress={() => {
                                setCurrentRegistration(registration)
                                onScoreReportOpen()
                            }}
                        >
                            <FaClipboardCheck size={20} />
                            {isDesktop && (
                                <span>
                                    {registration.score == null
                                        ? 'Report Unavailable'
                                        : 'View Score Report'}
                                </span>
                            )}
                        </Button>
                    )
                default:
                    return null
            }
        },
        [isDesktop]
    )

    return (
        <>
            <ScoreReportModal
                registration={currentRegistration!}
                event={event}
                isOpen={isScoreReportOpen}
                onOpenChange={onScoreReportOpenChange}
            ></ScoreReportModal>
            <Table
                className="mb-5"
                aria-label={event.name + ' scores table'}
                topContent={<EventTopContent event={event} />}
            >
                <TableHeader columns={columns}>
                    {(column) => {
                        let className = ''
                        if (column.key === 'actions') {
                            className = 'w-[1%] whitespace-nowrap text-center' // small fixed width
                        } else {
                            className = 'text-center' // flexibly expands
                        }

                        return (
                            <TableColumn key={column.key} className={className}>
                                {column.label}
                            </TableColumn>
                        )
                    }}
                </TableHeader>

                <TableBody items={event.registrations || []}>
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
        </>
    )
}
