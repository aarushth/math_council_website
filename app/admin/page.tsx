import { getServerSession } from 'next-auth'

import { redirect } from 'next/navigation'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin) {
        redirect('/')
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <AdminDashboard />
        </div>
    )
}
