'use client'

import { useMemo, useState } from 'react'
import { Spinner, Input } from '@heroui/react'
import { FaSearch } from 'react-icons/fa'

import UserCard from './UserCard'

import { User } from '@/lib/primitives'
import { useUpdateUserRole } from '@/components/hooks/useAdminQueries'

interface Props {
    users: User[]
}
export default function UserList({ users }: Props) {
    const [filterValue, setFilterValue] = useState('')
    const hasSearchFilter = filterValue.trim().length > 0
    const updateUserRoleMutation = useUpdateUserRole()

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

        return filteredUsers
    }, [users, filterValue, hasSearchFilter])

    if (users.length <= 0) {
        return <Spinner />
    }

    function changeRole(user: User) {
        updateUserRoleMutation.mutate({
            id: user.id,
            admin: !user.admin,
        })
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
