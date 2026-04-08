import { redirect } from 'next/navigation'
import { getAdminBasePath } from '@/lib/admin-config'

export const metadata = {
  title: 'Admin Products | Nexzen',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminProductsPage() {
  const adminBasePath = getAdminBasePath()
  redirect(adminBasePath)
}
