import ProfileShell from '@/components/profile/ProfileShell'

const tools = [
  { href: '/products', label: 'Continue shopping' },
  { href: '/cart', label: 'Open cart' },
  { href: '/active-orders', label: 'Active orders' },
  { href: '/ordered-items', label: 'Ordered items' },
]

export default function ProfilePage() {
  return <ProfileShell tools={tools} showProfileForm />
}
