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
    NumberInput,
    Button,
} from '@heroui/react'
import {
    errorToast,
    Event,
    Registration,
    successToast,
    User,
} from '@/components/primitives'
import { useCallback, Key, useState, useMemo, useEffect } from 'react'
import EventTopContent from '@/components/EventTopContent'
import { useMediaQuery } from '@/components/useMediaQuery'
import { FaList, FaSearch } from 'react-icons/fa'

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
    const [isChanges, setIsChanges] = useState(false)
    const [page, setPage] = useState(1)

    const [filterValue, setFilterValue] = useState('')
    const isDesktop = useMediaQuery('(min-width: 768px)')

    const hasSearchFilter = filterValue.trim().length > 0

    const rowsPerPage = 4

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
        console
        return filteredRegs
    }, [registrations, filterValue])
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
    ].filter(
        (column) => (isDesktop as unknown as Boolean) || column.key !== 'user'
    )
    const saveScores = async () => {
        try {
            const payload = registrations.map((r) => ({
                id: r.id,
                score: r.score,
            }))

            const res = await fetch('/api/registration/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error('Failed to save scores')
            }
            setIsChanges(false)
            successToast()
        } catch (err) {
            errorToast()
        }
    }

    const renderCell = useCallback(
        (registration: Registration, columnKey: Key) => {
            const cellValue = registration[columnKey as keyof Registration]

            switch (columnKey) {
                case 'grade':
                    return cellValue === 0 ? 'KG' : cellValue
                case 'user':
                    const user = cellValue as unknown as User
                    return user.email
                case 'score':
                    return (
                        <NumberInput
                            placeholder={!cellValue ? 'Enter Score' : ''}
                            minValue={0}
                            maxValue={
                                event.totalScore ? event.totalScore : undefined
                            }
                            isClearable
                            value={Number(cellValue)}
                            onValueChange={(e) => {
                                setIsChanges(true)
                                setRegistrations((prev) =>
                                    prev.map((r) =>
                                        r.id === registration.id
                                            ? { ...r, score: e }
                                            : r
                                    )
                                )
                            }}
                        />
                    )
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
    async function onLoadRegistrationsClick() {
        setIsLoading(true)
        fetch(`/api/registration/${event.id}`)
            .then((res) => res.json())
            .then((data) => {
                setRegistrations(data.registration)
                setRegistrationsLoaded(true)
                setIsLoading(false)
            })
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
            bottomContent={
                registrationsLoaded ? (
                    <div className="flex w-full justify-between gap-5">
                        <Input
                            size="md"
                            className="flex-1 max-w-sm px-0"
                            isClearable
                            placeholder="   Search"
                            startContent={<FaSearch />}
                            value={filterValue}
                            variant="bordered"
                            onClear={() => setFilterValue('')}
                            onValueChange={onSearchChange}
                        />
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                        <Button
                            className="flex-1 max-w-sm"
                            color="success"
                            isDisabled={!isChanges}
                            onPress={saveScores}
                        >
                            Save
                        </Button>
                    </div>
                ) : (
                    <div
                        className="cursor-pointer text-primary-500 flex flex-row items-center gap-2 p-2 rounded-xl hover:bg-primary-500 hover:text-black"
                        onClick={onLoadRegistrationsClick}
                    >
                        <FaList className="size-5" />
                        <p>View Registrations</p>
                    </div>
                )
            }
        >
            <TableHeader columns={registrationsLoaded ? columns : []}>
                {(column) => (
                    <TableColumn
                        className="text-center px-0 max-width-1"
                        key={column.key}
                    >
                        {column.label}
                    </TableColumn>
                )}
            </TableHeader>

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
    )
}
