import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { AccountHeader, AccountSidebar } from '@/components/account/AccountNav'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/ingresar?next=/cuenta')

  return (
    <section className="px-6 sm:px-10 lg:px-20 pt-8 sm:pt-14 lg:pt-20 pb-20 sm:pb-24 lg:pb-28">
      <div className="max-w-6xl mx-auto">
        <AccountHeader firstName={user.name.split(' ')[0] ?? user.name} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="hidden lg:block lg:col-span-3">
            <AccountSidebar />
          </div>
          <div className="lg:col-span-9 xl:col-span-8">{children}</div>
        </div>
      </div>
    </section>
  )
}
