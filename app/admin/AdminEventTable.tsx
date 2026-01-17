'use client'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    Input,
    Pagination,
    Button,
    useDisclosure,
} from '@heroui/react'
import { errorToast, Event, Registration } from '@/components/primitives'
import { useCallback, Key, useState, useMemo } from 'react'
import EventTopContent from '@/components/EventTopContent'
import { useMediaQuery } from '@/components/useMediaQuery'
import { FaClipboardCheck, FaList, FaSearch } from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useAppDateFormatter } from '@/components/useAppDateFormatter'
import EditScoreReportModal from './EditScoreReportModal'
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
                            variant="solid"
                            onPress={() => {
                                setCurrentRegistration(registration)
                                onScoreReportOpen()
                            }}
                        >
                            <FaClipboardCheck size={20} />
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
        } catch (err) {
            console.error(err)
            errorToast()
        }
    }
    async function onLoadRegistrationsClick(): Promise<Registration[]> {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/registration/${event.id}`)
            const data = await res.json()

            setRegistrations(data.registration)
            setRegistrationsLoaded(true)
            console.log(data.registration)
            return data.registration
        } catch (err) {
            console.error('Failed to load registrations', err)
            return []
        } finally {
            setIsLoading(false)
        }
    }
    async function generatePDF() {
        let regsToUse = sortedRegistrations

        // If registrations not loaded yet, fetch them
        if (!registrationsLoaded) {
            regsToUse = await onLoadRegistrationsClick()
        }
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        })

        // Title
        doc.setFontSize(16)
        doc.text(
            `${event.name} Registrations - ${formatter.format(new Date(event.date))}`,
            14,
            15
        )

        // Prepare table rows
        const tableBody = regsToUse.map((reg) => [
            reg.studentName,
            reg.grade.toString(),
            reg.user?.email ?? 'N/A',
        ])

        // Create table
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
            console.error('Failed to open print window')
            return
        }

        printWindow.onload = () => {
            printWindow.focus()
            printWindow.print()
        }
    }
    function updateRegistration(updatedRegistration: Registration) {
        if (!updatedRegistration.id) {
            console.error(
                'Cannot update registration without id',
                updatedRegistration
            )
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
    return (
        <>
            <EditScoreReportModal
                registration={currentRegistration!}
                updateRegistration={updateRegistration}
                event={event}
                isOpen={isScoreReportOpen}
                onOpenChange={onScoreReportOpenChange}
            ></EditScoreReportModal>
            <Table
                aria-label={event.name + ' admin table'}
                topContent={
                    <EventTopContent
                        event={event}
                        editAllowed={true}
                        onEditClick={onEditClick}
                        onDeleteClick={deleteEvent}
                        onPrintClick={generatePDF}
                    />
                }
                className="mb-5"
                bottomContent={
                    registrationsLoaded ? (
                        <div className="grid w-full grid-cols-3 items-center">
                            <Pagination
                                className="col-start-2 justify-self-center"
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                            <Input
                                size="md"
                                className="max-w-xs col-start-3 justify-self-end"
                                isClearable
                                placeholder="Search"
                                startContent={<FaSearch />}
                                value={filterValue}
                                variant="bordered"
                                onClear={() => setFilterValue('')}
                                onValueChange={onSearchChange}
                            />
                        </div>
                    ) : (
                        <div
                            className="cursor-pointer text-primary-500 flex flex-row items-center gap-2 p-2 rounded-xl hover:bg-primary-500 dark:hover:text-black hover:text-white"
                            onClick={onLoadRegistrationsClick}
                        >
                            <FaList className="size-5" />
                            <p>View Registrations</p>
                        </div>
                    )
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
                    items={registrationsPaginated || []}
                    emptyContent={
                        isLoading ? (
                            <Spinner />
                        ) : registrationsLoaded ? (
                            'No registrations yet'
                        ) : (
                            ''
                        )
                    }
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
