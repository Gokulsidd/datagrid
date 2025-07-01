'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import DottedSeparator from '../dotted-separator'
import { GoHome, GoHomeFill, GoFileDirectory, GoFileDirectoryFill } from 'react-icons/go'
import { AiOutlineDatabase, AiFillDatabase } from 'react-icons/ai'

const sections = [
  {
    title: 'Collections',
    items: [
      {
        label: 'Our analytics',
        href: '/Our-analytics',
        icon: GoFileDirectory,
        activeIcon: GoFileDirectoryFill,
      },
      {
        label: 'Your personal collection',
        href: '/Your-personal-collection',
        icon: GoFileDirectory,
        activeIcon: GoFileDirectoryFill,
      },
      {
        label: 'Dashboards',
        href: '/Dashboards',
        icon: GoFileDirectory,
        activeIcon: GoFileDirectoryFill,
      },
      {
        label: 'Legal UK',
        href: '/Legal-UK',
        icon: GoFileDirectory,
        activeIcon: GoFileDirectoryFill,
      },
    ],
  },
  {
    title: 'Data',
    items: [
      {
        label: 'Browse data',
        href: '/Browse-data',
        icon: AiOutlineDatabase,
        activeIcon: AiFillDatabase,
      },
    ],
  },
]

const Navigation = () => {
  const pathname = usePathname()

  return (
    <aside className="w-fit h-full bg-white text-sm">
      {/* Home link */}
      <Link href="/">
        <div
          className={cn(
            'flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition font-medium text-gray-700',
            pathname === '/' && 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          )}
        >
          {pathname === '/' ? <GoHomeFill className="size-5" /> : <GoHome className="size-5" />}
          <span>Home</span>
        </div>
      </Link>

          <DottedSeparator className='my-2' />

      {/* Sections */}
      {sections.map((section) => (
          <div key={section.title} className="my-4 flex flex-col gap-1">
          <p className="px-2 text-gray-500 font-semibold text-xs uppercase tracking-wider">{section.title}</p>
          {section.items.map((item) => {
              const isActive = pathname === item.href
              const Icon = isActive ? item.activeIcon : item.icon
              
              return (
                  <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                      'flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition font-medium text-gray-700',
                      isActive && 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    )}
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
        })}
        <DottedSeparator className='my-2' />
        </div>
      ))}
    </aside>
  )
}

export default Navigation
