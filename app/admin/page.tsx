import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import AdminDashboard from './AdminDashboard'

import { authOptions } from '@/pages/api/auth/[...nextauth]'

export default async function AdminPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin) {
        redirect('/')
    }

    return <AdminDashboard />
}
