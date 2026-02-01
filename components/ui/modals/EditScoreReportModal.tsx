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
    Button,
} from '@heroui/react'

import { Registration, Event } from '@/lib/primitives'
import { useUpdateRegistration } from '@/components/hooks/useAdminQueries'

interface Props {
    registration: Registration
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
    event,
    isOpen,
    onOpenChange,
}: Props) {
    const [isSaveActive, setIsSaveActive] = useState(false)
    const [scoreReport, setScoreReport] = useState<boolean[]>([])
    const updateRegistrationMutation = useUpdateRegistration(event.id)

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
    }, [isOpen, registration, event.totalScore])
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

    function submit(onClose: () => void) {
        updateRegistrationMutation.mutate(
            {
                id: registration.id,
                scoreReport: scoreReport,
                score: score,
            },
            {
                onSuccess: () => {
                    setIsSaveActive(false)
                    onClose()
                },
            }
        )
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
