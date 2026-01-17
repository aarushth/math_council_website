'use client'

import { useMemo, useState } from 'react'
import { Input, Spinner } from '@heroui/react'
import { FaSearch } from 'react-icons/fa'

import UserCard from './UserCard'

import { errorToast, User } from '@/components/primitives'

interface Props {
    users: User[]
    updateUser: (u: User) => void
}
export default function UserList({ users, updateUser }: Props) {
    const [filterValue, setFilterValue] = useState('')
    const hasSearchFilter = filterValue.trim().length > 0

    const filteredUsers = useMemo(() => {
        let filteredUsers = [...users]

        if (hasSearchFilter) {
            filteredUsers = users.filter(
                (user) =>
                    user.name
                        .toLowerCase()
                        .includes(filterValue.toLowerCase()) ||
                    user.email.toLowerCase().includes(filterValue.toLowerCase())
            )
        }
        console

        return filteredUsers
    }, [users, filterValue])

    if (users.length <= 0) {
        return <Spinner />
    }

    async function changeRole(user: User) {
        try {
            const res = await fetch(`/api/user/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    admin: !user.admin,
                }),
            })

            if (!res.ok) throw new Error('Failed to create registration')
            const updatedUser = await res.json()

            updateUser(updatedUser.user)
        } catch {
            errorToast()
        }
    }

    return (
        <>
            <div className="flex flex-row items-baseline gap-20">
                <h1 className="text-xl mb-3 mt-6">Users</h1>
                <Input
                    isClearable
                    className="flex-1"
                    placeholder="Search"
                    startContent={<FaSearch />}
                    value={filterValue}
                    variant="bordered"
                    onClear={() => setFilterValue('')}
                    onValueChange={setFilterValue}
                />
            </div>
            {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} onRoleChange={changeRole} />
            ))}
        </>
    )
}
