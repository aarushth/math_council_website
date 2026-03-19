'use client'
import { useState } from 'react'
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react'

import GradeSlider from '../GradeSlider'

import { Event } from '@/lib/primitives'
interface Props {
    isOpen: boolean
    onOpenChange: () => void
    event: Event
    onPrintEvent: (range: number[]) => void
}

export default function EventModal({
    isOpen,
    onOpenChange,
    event,
    onPrintEvent,
}: Props) {
    const [range, setRange] = useState<number[]>([0, 8])

    return (
        <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {`Print ${event?.name} Registrations`}
                        </ModalHeader>
                        <ModalBody>
                            <GradeSlider
                                maxValue={event.maxGrade}
                                minValue={event.minGrade}
                                range={range}
                                setRange={setRange}
                                title="Grades to Print"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="ghost"
                                onPress={() => {
                                    onClose()
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={() => {
                                    onPrintEvent(range)
                                    onClose()
                                }}
                            >
                                Print
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
