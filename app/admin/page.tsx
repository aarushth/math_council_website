import { getServerSession } from 'next-auth'

import { redirect } from 'next/navigation'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import AdminDashboard from './AdminDashboard'
import { Button } from '@heroui/button'
import { FaPlus } from 'react-icons/fa'

export default async function AdminPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin) {
        redirect('/')
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <AdminDashboard />
        </div>
    )
}
