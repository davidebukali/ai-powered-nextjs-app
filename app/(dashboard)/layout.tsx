'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import classNames from 'classnames'
import Image from 'next/image'

const Links = [
  { href: '/', label: 'Home' },
  { href: '/journal', label: 'Journal' },
  { href: '/history', label: 'History' },
]

const DashboardLayout = ({ children }) => {
  const [sliderState, setSliderState] = useState(true)
  const renderLinks = () => {
    return Links.map((link) => (
      <li key={link.label} className="px-2 py-4 text-lg">
        <Link href={link.href}>{link.label}</Link>
      </li>
    ))
  }

  const toggleSlideOver = () => {
    setSliderState(!sliderState)
  }

  return (
    <div className="h-screen w-screen">
      <div className="h-full w-full">
        <header className="h-[60px]">
          <div className="flex">
            <span className="text-2xl pt-4 py-2 ml-4 cursor-pointer visible sm:invisible">
              <FaBars onClick={() => toggleSlideOver()} />
            </span>
            <span className="flex flex-row basis-1/4 py-4 cursor-pointer">
              <Image
                src="/images/logov3.jpg"
                alt="logo"
                width={50}
                height={40}
              />
              <span className="text-3xl px-2">Mood</span>
            </span>
            <ul className="flex basis-1/2 invisible sm:visible">
              {renderLinks()}
            </ul>
            <div className="basis-1/4 w-full flex px-6 items-center justify-end">
              <UserButton />
            </div>
          </div>
        </header>
        <div
          id="slideover-container"
          className={classNames('absolute h-full w-full', {
            invisible: sliderState,
          })}
        >
          <div
            id="sliderover-bg"
            className={classNames(
              'absolute duration-500 ease-out transition-all inset-0 w-full h-full bg-gray-900',
              { 'opacity-0': sliderState },
              { 'opacity-50': !sliderState }
            )}
          ></div>
          <div
            id="slideover"
            className={classNames(
              'absolute duration-500 ease-out transition-all left-0 bg-white w-[200px] h-full',
              {
                '-translate-x-full': sliderState,
              }
            )}
          >
            <ul className="">{renderLinks()}</ul>
          </div>
        </div>

        <div className="h-full">{children}</div>
      </div>
    </div>
  )
}

export default DashboardLayout
