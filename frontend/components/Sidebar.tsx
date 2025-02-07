import React, { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AiFillHome, AiOutlineMenu } from 'react-icons/ai'
import { ImCancelCircle } from 'react-icons/im'

import Discover from './Discover'
import Footer from './Footer'
import SuggestedAccounts from './SuggestedAccounts'
import useAuthStore from '@/store/authStore'

const Sidebar: NextPage = () => {
    const [showSidebar, setShowSidebar] = useState<Boolean>(true)

    const { pathname } = useRouter()

    const { allUsers, fetchAllUsers } = useAuthStore()

    return (
        <div>
            <div 
                className='block xl:hidden m-2 ml-[25px] mt-3 text-2xl cursor-pointer' 
                onClick={() => setShowSidebar((prev) => !prev)}
            >
                {showSidebar ? (
                    <ImCancelCircle />
                ) : (
                    <AiOutlineMenu />
                )}
            </div>
            {showSidebar && (
                <div className='xl:w-400 w-20 flex flex-col justify-start mb-10 border-r-2 border-gray-100 xl:border-0 p-3 pl-0'>
                    <div className='xl:border-b-2 border-gray-200 xl:pb-4'>
                        <Link href='/'>
                            <div className={`flex items-center gap-3 hover:bg-primary p-3 pl-2 justify-center xl:justify-start cursor-pointer font-semibold rounded ${pathname === '/' ? 'text-[#f51997]' : ''}`}>
                                <p className="text-2xl">
                                    <AiFillHome />
                                </p>
                                <span className='capitalize text-xl hidden xl:block'>
                                    for you
                                </span>
                            </div>
                        </Link>
                    </div>
                    <Discover />
                    <SuggestedAccounts allUsers={allUsers} fetchAllUsers={fetchAllUsers} />
                    <Footer />
                </div>
            )}
        </div>
    )
}

export default Sidebar