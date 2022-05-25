import React from 'react'
import Image from 'next/image'

const Nav = () => {
  return (
    <nav>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center">
            <a href='/'
              className="flex-shrink-0 flex items-center"
              style={{ fontWeight: 'bold', color: 'white', cursor: 'pointer' }}
            >
              <img src='/Hive-Logo.png' alt='logo' style={{ width: '3em' }}/>
            </a>
          </div>
        </div>
      </div>

      <div className="sm:hidden" id="mobile-menu" />
    </nav>
  )
}

export default Nav
