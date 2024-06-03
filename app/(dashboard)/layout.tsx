import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const Links = [
  { href: '/', label: 'Home' },
  { href: '/journal', label: 'Journal' },
  { href: '/history', label: 'History' },
]

const DashboardLayout = ({ children }) => {
  return (
    <div className="h-screen w-screen relative">
      <aside className="absolute top-0 left-0 h-full w-[200px] border-r border-black/10">
        <div className="px-4 my-4">
          <span className="text-3xl">Mood</span>
          <ul>
            {Links.map((link) => (
              <li key={link.label} className="px-2 py-4 text-2xl">
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="ml-[200px] h-full w-[calc(100vw-200px)]">
        <header className="h-[60px] border-b border-black/10">
          <div className="h-full px-6 flex items-center justify-end">
            <UserButton />
          </div>
        </header>
        <div className="h-full">{children}</div>
      </div>
    </div>
  )
}

export default DashboardLayout
