'use client'

import { BsThreeDotsVertical } from 'react-icons/bs'
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Button,
    User,
    Chip,
} from '@heroui/react'

import { User as PrimitiveUser } from '@/lib/primitives'

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
                    imgProps: { loading: 'lazy', decoding: 'async' },
                }}
                description={user.email}
                name={user.name}
            />
            <Chip
                color={user.admin ? 'danger' : 'default'}
                size="sm"
                variant="flat"
            >
                {user.admin ? 'admin' : 'user'}
            </Chip>
            {!user.admin && (
                <Dropdown>
                    <DropdownTrigger>
                        <Button className="gap-0 min-w-0 px-2" variant="light">
                            <BsThreeDotsVertical size={20} />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Static Actions"
                        onAction={() => {
                            onRoleChange(user)
                        }}
                    >
                        <DropdownItem key="changeRole">
                            Change Role
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            )}
        </div>
    )
}
