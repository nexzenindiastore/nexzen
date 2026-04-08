import DecoyLoginForm from '@/components/admin/DecoyLoginForm'

export const metadata = {
  title: 'Account Sign In | Nexzen',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AccountSigninPage() {
  return (
    <DecoyLoginForm
      title="Account Sign In"
      description="Use your assigned operator credentials to continue to the restricted dashboard."
    />
  )
}
