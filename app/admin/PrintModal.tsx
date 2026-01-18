'use client'
import { useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Slider,
} from '@heroui/react'

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
    const [range, setRange] = useState([0, 8])

    return (
        <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {`Print ${event?.name} Registrations`}
                        </ModalHeader>
                        <ModalBody>
                            <Slider
                                showSteps
                                className="max-w-md"
                                getValue={(value) => {
                                    return Array.isArray(value)
                                        ? `${value[0] === 0 ? 'KG' : value[0]}-${value[1]}`
                                        : value.toString()
                                }}
                                label="Grades to Print"
                                marks={[
                                    {
                                        value: 0,
                                        label: 'KG',
                                    },
                                    {
                                        value: 1,
                                        label: '1',
                                    },
                                    {
                                        value: 2,
                                        label: '2',
                                    },
                                    {
                                        value: 3,
                                        label: '3',
                                    },
                                    {
                                        value: 4,
                                        label: '4',
                                    },
                                    {
                                        value: 5,
                                        label: '5',
                                    },
                                    {
                                        value: 6,
                                        label: '6',
                                    },
                                    {
                                        value: 7,
                                        label: '7',
                                    },
                                    {
                                        value: 8,
                                        label: '8',
                                    },
                                ]}
                                maxValue={8}
                                minValue={0}
                                step={1}
                                value={range}
                                onChange={(r) => setRange(r as number[])}
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
                                    onPrintEvent(range as number[])
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
