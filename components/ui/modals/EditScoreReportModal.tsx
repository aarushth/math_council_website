import { useCallback, useEffect, useState, Key, useMemo } from 'react'
import { FaRegCheckCircle } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    addToast,
    Button,
} from '@heroui/react'

import { Registration, Event } from '@/lib/primitives'

interface Props {
    registration: Registration
    updateRegistration: (registration: Registration) => void
    event: Event
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
}
type ScoreReportRow = {
    index: number
    result: boolean
}
export default function EditScoreReportModal({
    registration,
    updateRegistration,
    event,
    isOpen,
    onOpenChange,
}: Props) {
    const [isSaveActive, setIsSaveActive] = useState(false)
    const [scoreReport, setScoreReport] = useState<boolean[]>([])

    useEffect(() => {
        if (isOpen) {
            if (registration.scoreReport.length != 0) {
                const clonedScoreReport = structuredClone(
                    registration.scoreReport
                )

                setScoreReport(clonedScoreReport)
            } else {
                setScoreReport(Array(event.totalScore!).fill(false))
            }
            setIsSaveActive(false)
        }
    }, [isOpen, registration])
    const score = useMemo(() => {
        return scoreReport.reduce((count, value) => count + (value ? 1 : 0), 0)
    }, [scoreReport])
    const scoreReportWithIndex: ScoreReportRow[] = scoreReport.map(
        (result, index) => ({
            index,
            result,
        })
    )
    const columns = [
        {
            key: 'questionNumber',
            label: 'Question Number',
        },
        {
            key: 'result',
            label: 'Result',
        },
    ]
    const renderCell = useCallback(
        (item: ScoreReportRow, columnKey: Key): React.ReactNode => {
            switch (columnKey) {
                case 'questionNumber':
                    return item.index + 1
                case 'result':
                    return (
                        <Button
                            className="min-w-30"
                            color={item.result ? 'success' : 'danger'}
                            variant="flat"
                            onPress={() => {
                                // immutably toggle the result
                                setScoreReport((prev) =>
                                    prev.map((val, idx) =>
                                        idx === item.index ? !val : val
                                    )
                                )
                                setIsSaveActive(true)
                            }}
                        >
                            {item.result ? <FaRegCheckCircle /> : <ImCross />}
                            {item.result ? 'Correct' : 'Incorrect'}
                        </Button>
                    )
                default:
                    return null
            }
        },
        []
    )

    async function submit(onClose: () => void) {
        try {
            const res = await fetch(`/api/registration/${registration.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scoreReport: scoreReport,
                    score: score,
                }),
            })

            if (!res.ok) throw new Error('Failed to update registration')
            const data = await res.json()

            updateRegistration(data.registration)
            setIsSaveActive(false)
            onClose()
        } catch {
            addToast({ title: 'An error ocurred. Please try again later.' })
        }
    }

    return (
        <>
            <Modal
                isDismissable={!isSaveActive}
                isKeyboardDismissDisabled={isSaveActive}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Score Report for {registration.studentName} —{' '}
                                {score} / {event.totalScore}
                            </ModalHeader>
                            <ModalBody>
                                <Table
                                    isHeaderSticky
                                    aria-label={
                                        registration.studentName +
                                        ' score report'
                                    }
                                    className="max-h-100"
                                >
                                    <TableHeader columns={columns}>
                                        {(column) => (
                                            <TableColumn
                                                key={column.key}
                                                className="text-center px-0 max-width-1"
                                            >
                                                {column.label}
                                            </TableColumn>
                                        )}
                                    </TableHeader>

                                    <TableBody
                                        emptyContent={
                                            'event Total Score not Set'
                                        }
                                        items={scoreReportWithIndex}
                                    >
                                        {(item) => (
                                            <TableRow key={item.index}>
                                                {(columnKey) => (
                                                    <TableCell className="text-center">
                                                        {renderCell(
                                                            item,
                                                            columnKey
                                                        )}
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    className="flex-1 max-w-sm"
                                    color="success"
                                    isDisabled={!isSaveActive}
                                    onPress={() => submit(onClose)}
                                >
                                    Save
                                </Button>{' '}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
