import React, { useEffect } from 'react'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { GoVerified } from 'react-icons/go'

import { IUser } from '@/type'

interface IProps {
    fetchAllUsers : () => void;
    allUsers: IUser[];
}

const SuggestedAccounts: NextPage<IProps> = ({ allUsers, fetchAllUsers }) => {
    useEffect(() => {
        fetchAllUsers()
    }, [fetchAllUsers])

    const users = allUsers?.sort(() => 0.5 - Math.random()).slice(0, allUsers?.length)

    return (
        <div className='xl:border-b-2 border-gray-200 pb-4'>
            <p className='text-gray-500 font-semibold m-3 mt-4 hidden xl:block'>
                Suggested Accounts
            </p>
            <div>
                {users?.slice(0, 6)?.map((user: IUser) => (
                    <Link href={`/profile/${user._id}`} key={user._id}>
                        <div className='flex gap-3 hover:bg-primary p-2 py-2.5 cursor-pointer font-semibold rounded'>
                            <div className='w-11 h-11'>
                                <Image 
                                    src={user.image}
                                    width={44}
                                    height={44}
                                    alt='user-profile'
                                    className='rounded-full'
                                />
                            </div>
                            <div className='hidden xl:block'>
                                <p className='flex gap-2 items-center text-base font-bold text-primary lowercase'>
                                    {user.userName.replace(/\s+/g, '_')}{' '}
                                    {/* {user.userName}{' '} */}
                                    <GoVerified className='text-blue-400' />
                                </p>
                                <p className='capitalize text-gray-400 text-xs'>
                                    {user.userName}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SuggestedAccounts