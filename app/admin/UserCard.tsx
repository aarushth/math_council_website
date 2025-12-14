'use client'

import { User as PrimitiveUser } from '@/components/primitives'
import {
    User,
    Chip,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from '@heroui/react'
import { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'

interface Props {
    user: PrimitiveUser
    onRoleChange: (user: PrimitiveUser) => void
}
export default function UserCard({ user, onRoleChange }: Props) {
    return (
        <div className="flex flex-row gap-3 items-center justify-between mb-5">
            <User
                avatarProps={{
                    showFallback: true,
                    src: user.picture ? user.picture : undefined,
                }}
                description={user.email}
                name={user.name}
            ></User>
            <Chip
                size="sm"
                color={user.admin ? 'danger' : 'default'}
                variant="flat"
            >
                {user.admin ? 'admin' : 'user'}
            </Chip>
            {!user.admin && (
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            className="gap-0 min-w-0 px-2"
                            variant="light"
                            onPress={() => console.log('click')}
                        >
                            <BsThreeDotsVertical size={20} />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Static Actions"
                        onAction={(key) => {
                            onRoleChange(user)
                        }}
                    >
                        <DropdownItem key="changeRole">
                            Promote to Admin
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            )}
        </div>
    )
}
