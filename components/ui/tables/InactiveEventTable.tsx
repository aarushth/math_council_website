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
import { useCallback, Key, ReactNode, useState } from 'react'
import { FaClipboardCheck, FaFileAlt } from 'react-icons/fa'

import ScoreReportModal from '@/components/ui/modals/ScoreReportModal'
import EventTopContent from '@/components/ui/tables/EventTopContent'
import { Event, Registration } from '@/lib/primitives'
import { useMediaQuery } from '@/components/hooks/useMediaQuery'

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
                            isDisabled={
                                registration.score != null ? false : true
                            }
                            isIconOnly={!isDesktop}
                            startContent={<FaClipboardCheck size={20} />}
                            variant="solid"
                            onPress={() => {
                                setCurrentRegistration(registration)
                                onScoreReportOpen()
                            }}
                        >
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
                event={event}
                isOpen={isScoreReportOpen}
                registration={currentRegistration!}
                onOpenChange={onScoreReportOpenChange}
            />
            <Table
                aria-label={event.name + ' scores table'}
                bottomContent={
                    event.questionPdf && (
                        <Button
                            className="bg-white/0 justify-start cursor-pointer text-primary-500 flex flex-row items-center gap-2 p-2 rounded-xl hover:bg-primary-500 dark:hover:text-black hover:text-white"
                            size="lg"
                            startContent={<FaFileAlt size={20} />}
                            onPress={() => {
                                window.open(event.questionPdf!, '_blank')
                            }}
                        >
                            <p>View Questions & Solutions</p>
                        </Button>
                    )
                }
                className="mb-5"
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
