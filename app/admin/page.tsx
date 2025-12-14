import { getServerSession } from 'next-auth'

import { redirect } from 'next/navigation'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.admin) {
        redirect('/')
    }

    return <AdminDashboard />
}
