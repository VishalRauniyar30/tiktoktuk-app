import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { GoogleLogin, googleLogout } from '@react-oauth/google'
import { AiOutlineLogout } from 'react-icons/ai'
import { BiSearch } from 'react-icons/bi'
import { IoMdAdd } from 'react-icons/io'

import useAuthStore from '@/store/authStore'
import { IUser } from '@/type'
import { createOrGetUser } from '@/utils'
import Logo from '@/utils/tiktik-logo.png'
import Logo2 from '@/utils/best.jpg'

const Navbar = () => {
    const [user, setUser] = useState<IUser | null>()
    const [searchValue, setSearchValue] = useState('')
    const router = useRouter()

    const { pathname } = useRouter()
    const { userProfile, addUser, removeUser } = useAuthStore()

    useEffect(() => {
        setUser(userProfile)
    }, [userProfile])

    const handleSearch = (e: { preventDefault: () => void }) => {
        e.preventDefault()

        if(searchValue) {
            const newSearchValue = searchValue.toLowerCase()
            router.push(`/search/${newSearchValue}`)
        }
    }

    return (
        <div className='w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4'> 
            <Link href='/'>
                <div className='w-[100px] md:w-[130px] md:h-[30px] h-[38px]'>
                    <Image 
                        src={Logo}
                        className='cursor-pointer'
                        alt='logo'
                        width={130}
                        height={130}
                    />
                </div>
            </Link>
            <div className='relative hidden lg:block lg:-mr-28 mr-0'>
                <form
                    onSubmit={handleSearch}
                    className='absolute md:static top-10 -left-20 bg-white'
                >
                    <input
                        value={searchValue}
                        type='text'
                        onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
                        placeholder='Search Accounts and Videos'
                        className='bg-primary py-4 px-10 md:text-base font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[300px] md:w-[350px] rounded-full md:top-0'
                    />
                    <button 
                        onClick={handleSearch}
                        className='absolute md:right-5 right-6 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400'
                    >
                        <BiSearch />
                    </button>
                </form>
            </div>
            <div>
                {user ? (
                    <div className='flex gap-5 md:gap-6 items-center'>
                        {pathname !== '/upload' && (
                            <Link href='/upload'>
                                <button className='border-2 px-2 py-[6px] rounded-lg md:px-4 text-base font-semibold flex items-center gap-2'>
                                    <IoMdAdd className='text-xl' />{' '}
                                    <span className='hidden md:block'>Upload </span>
                                </button>
                            </Link>
                        )}
                        {user.image && (
                            <Link href={`/profile/${user._id}`}>
                                <div className='flex flex-row items-center justify-center'>
                                    <Image
                                        src={user.image}
                                        width={40}
                                        height={40}
                                        alt='user'
                                        className='rounded-full cursor-pointer mr-3'
                                    />
                                    <p className='text-md text-gray-500'>{user.userName}</p>
                                </div>
                            </Link>
                        )}
                        <button
                            type='button'
                            onClick={() => {
                                googleLogout()
                                removeUser()
                            }}
                            className='border-2 p-2 rounded-full cursor-pointer outline-none shadow-md'
                        >
                            <AiOutlineLogout color='red' fontSize={21} />
                        </button>
                    </div>
                ) : (
                    <GoogleLogin 
                        onSuccess={(res) => createOrGetUser(res, addUser)}
                        onError={() => console.log('Login Failed')}
                    />
                )}
            </div>
        </div>
    )
}

export default Navbar