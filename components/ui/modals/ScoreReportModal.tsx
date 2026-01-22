import { useCallback, Key } from 'react'
import { FaRegCheckCircle } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'

import {
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Table,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from '@heroui/react'

import { Registration, Event } from '@/lib/primitives'

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
export default function ScoreReportModal({
    registration,
    event,
    isOpen,
    onOpenChange,
}: Props) {
    const scoreReportWithIndex: ScoreReportRow[] = registration
        ? registration.scoreReport.map((result, index) => ({
              index,
              result,
          }))
        : []
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
                            className="min-w-30 disabled:opacity-100"
                            color={item.result ? 'success' : 'danger'}
                            isDisabled={true}
                            variant="flat"
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

    return (
        <>
            <Modal
                isOpen={isOpen}
                placement="center"
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Score Report for {registration?.studentName} —{' '}
                        {registration?.score} / {event.totalScore}
                    </ModalHeader>
                    <ModalBody>
                        <Table
                            isHeaderSticky
                            aria-label={
                                registration?.studentName + ' score report'
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
                                emptyContent={'event Total Score not Set'}
                                items={scoreReportWithIndex}
                            >
                                {(item) => (
                                    <TableRow key={item.index}>
                                        {(columnKey) => (
                                            <TableCell className="text-center">
                                                {renderCell(item, columnKey)}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
