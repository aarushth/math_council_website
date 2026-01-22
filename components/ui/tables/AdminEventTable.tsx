'use client'

import { useCallback, Key, useState, useMemo } from 'react'
import { FaClipboardCheck, FaList, FaSearch } from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import {
    addToast,
    Button,
    Input,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from '@heroui/react'

import PrintModal from '../modals/PrintModal'
import EditScoreReportModal from '../modals/EditScoreReportModal'

import { Event, Registration } from '@/lib/primitives'
import EventTopContent from '@/components/ui/tables/EventTopContent'
import { useAppDateFormatter } from '@/components/hooks/useAppDateFormatter'
import { useMediaQuery } from '@/components/hooks/useMediaQuery'

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
    const [registrationsLoaded, setRegistrationsLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [page, setPage] = useState(1)
    const [filterValue, setFilterValue] = useState('')
    const [currentRegistration, setCurrentRegistration] = useState<
        Registration | undefined
    >(undefined)
    const {
        isOpen: isScoreReportOpen,
        onOpen: onScoreReportOpen,
        onOpenChange: onScoreReportOpenChange,
    } = useDisclosure()
    const {
        isOpen: isPrintOpen,
        onOpen: onPrintOpen,
        onOpenChange: onPrintOpenChange,
    } = useDisclosure()

    const isDesktop: boolean = useMediaQuery('(min-width: 768px)')

    const hasSearchFilter = filterValue.trim().length > 0

    const rowsPerPage = 4
    let formatter = useAppDateFormatter()

    //sorting
    const sortedRegistrations = registrations.sort((a, b) => {
        const gradeA = a.grade ?? 0
        const gradeB = b.grade ?? 0

        return gradeA - gradeB
    })

    //search
    const filteredRegistrations = useMemo(() => {
        let filteredRegs = [...registrations]

        if (hasSearchFilter) {
            filteredRegs = filteredRegs.filter(
                (registration) =>
                    registration.studentName
                        .toLowerCase()
                        .includes(filterValue.toLowerCase()) ||
                    registration.user?.email
                        .toLowerCase()
                        .includes(filterValue.toLowerCase())
            )
        }

        return filteredRegs
    }, [sortedRegistrations, filterValue])

    //pagination
    const pages = Math.ceil(filteredRegistrations.length / rowsPerPage)
    const registrationsPaginated = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return filteredRegistrations.slice(start, end)
    }, [page, filteredRegistrations])

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value)
            setPage(1)
        } else {
            setFilterValue('')
        }
    }, [])
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
            key: 'user',
            label: 'Email',
        },
        {
            key: 'score',
            label: 'Score',
        },
        {
            key: 'actions',
            label: '',
        },
    ].filter((column) => isDesktop || column.key !== 'user')

    const renderCell = useCallback(
        (registration: Registration, columnKey: Key): React.ReactNode => {
            switch (columnKey) {
                case 'studentName':
                    return registration.studentName

                case 'grade':
                    return registration.grade === 0 ? 'KG' : registration.grade

                case 'user':
                    return registration.user?.email ?? ''

                case 'score':
                    return registration.score !== null
                        ? `${registration.score} ${event.totalScore ? `/ ${event.totalScore}` : ''}`
                        : 'Score not entered yet'
                case 'actions':
                    return (
                        <Button
                            className="gap-3"
                            startContent={<FaClipboardCheck size={20} />}
                            variant="solid"
                            onPress={() => {
                                setCurrentRegistration(registration)
                                onScoreReportOpen()
                            }}
                        >
                            <p>Edit Score Report</p>
                        </Button>
                    )
                default:
                    return null
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
        } catch {
            addToast({ title: 'An error ocurred. Please try again later.' })
        }
    }
    async function onLoadRegistrationsClick(): Promise<Registration[]> {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/registration/${event.id}`)
            const data = await res.json()

            setRegistrations(data.registration)
            setRegistrationsLoaded(true)

            return data.registration
        } catch {
            addToast({
                title: 'Failed to load registrations, please try again later',
            })

            return []
        } finally {
            setIsLoading(false)
        }
    }

    function updateRegistration(updatedRegistration: Registration) {
        if (!updatedRegistration.id) {
            return
        }

        setRegistrations((prev) =>
            prev.map((registration) =>
                registration.id === updatedRegistration.id
                    ? { ...registration, ...updatedRegistration }
                    : registration
            )
        )
    }

    async function generatePDF(range: number[]) {
        let regsToUse = sortedRegistrations

        if (!registrationsLoaded) {
            regsToUse = await onLoadRegistrationsClick()
        }
        regsToUse = regsToUse.filter(
            (registration) =>
                registration.grade >= range[0] && registration.grade <= range[1]
        )
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        })

        doc.setFontSize(16)
        doc.text(
            `${event.name} Registrations - ${formatter.format(new Date(event.date))}`,
            14,
            15
        )

        const tableBody = regsToUse.map((reg) => [
            reg.studentName,
            reg.grade === 0 ? 'KG' : reg.grade.toString(),
            reg.user?.email ?? 'N/A',
        ])

        autoTable(doc, {
            startY: 25,
            head: [['Student Name', 'Grade', 'User Email']],
            body: tableBody,
            styles: {
                fontSize: 10,
            },
        })

        const pdfBlob = doc.output('blob')
        const blobUrl = URL.createObjectURL(pdfBlob)
        const printWindow = window.open(blobUrl)

        if (!printWindow) {
            addToast({
                title: 'Failed to open print window, please try again later',
            })

            return
        }

        printWindow.onload = () => {
            printWindow.focus()
            printWindow.print()
        }
    }

    return (
        <>
            <EditScoreReportModal
                event={event}
                isOpen={isScoreReportOpen}
                registration={currentRegistration!}
                updateRegistration={updateRegistration}
                onOpenChange={onScoreReportOpenChange}
            />
            <PrintModal
                event={event}
                isOpen={isPrintOpen}
                onOpenChange={onPrintOpenChange}
                onPrintEvent={generatePDF}
            />
            <Table
                aria-label={event.name + ' admin table'}
                bottomContent={
                    registrationsLoaded ? (
                        <div className="grid w-full grid-cols-3 items-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                className="col-start-2 justify-self-center"
                                color="primary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                            <Input
                                isClearable
                                className="max-w-xs col-start-3 justify-self-end"
                                placeholder="Search"
                                size="md"
                                startContent={<FaSearch />}
                                value={filterValue}
                                variant="bordered"
                                onClear={() => setFilterValue('')}
                                onValueChange={onSearchChange}
                            />
                        </div>
                    ) : (
                        <Button
                            className="bg-white/0 justify-start cursor-pointer text-primary-500 flex flex-row items-center gap-2 p-2 rounded-xl hover:bg-primary-500 dark:hover:text-black hover:text-white"
                            size="lg"
                            startContent={<FaList size={20} />}
                            onPress={onLoadRegistrationsClick}
                        >
                            <p>View Registrations</p>
                        </Button>
                    )
                }
                className="mb-5"
                topContent={
                    <EventTopContent
                        editAllowed={true}
                        event={event}
                        onDeleteClick={deleteEvent}
                        onEditClick={onEditClick}
                        onPrintClick={onPrintOpen}
                    />
                }
            >
                <>
                    {registrationsLoaded && (
                        <TableHeader columns={columns}>
                            {(column) => {
                                let className = ''

                                if (column.key === 'actions') {
                                    className =
                                        'w-[1%] whitespace-nowrap text-right' // small fixed width
                                } else {
                                    className = 'text-center' // flexibly expands
                                }

                                return (
                                    <TableColumn
                                        key={column.key}
                                        className={className}
                                    >
                                        {column.label}
                                    </TableColumn>
                                )
                            }}
                        </TableHeader>
                    )}
                </>

                <TableBody
                    emptyContent={
                        isLoading ? (
                            <Spinner />
                        ) : registrationsLoaded ? (
                            'No registrations yet'
                        ) : (
                            ''
                        )
                    }
                    items={registrationsPaginated || []}
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
        </>
    )
}
