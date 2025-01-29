import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { GoVerified } from 'react-icons/go'

import useAuthStore from '@/store/authStore'
import { IUser, Video } from '@/type'
import { BASE_URL } from '@/utils'
import NoResults from '@/components/NoResults'
import VideoCard from '@/components/VideoCard'

const Search = ({ videos }: { videos: Video[] }) => {
    const [isAccounts, setIsAccounts] = useState<boolean>(false)

    const { allUsers }: { allUsers: IUser[] } = useAuthStore()

    const router = useRouter()

    const { searchTerm }: any = router.query

    const searchedAccounts = allUsers?.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className='w-full'>
            <div className='flex gap-10 mb-10 border-b-2 border-gray-200 z-50 bg-white w-full'>
                <p className={`text-xl font-semibold cursor-pointer ${isAccounts ? 'border-b-2 border-black' : 'text-gray-400'}`} onClick={() => setIsAccounts(true)}>
                    Accounts
                </p>
                <p className={`text-xl font-semibold cursor-pointer ${!isAccounts ? 'border-b-2 border-black' : 'text-gray-400'}`} onClick={() => setIsAccounts(false)}>
                    Videos
                </p>
            </div>
            {isAccounts ? (
                <div className='md:mt-8'>
                    {searchedAccounts?.length > 0 ? (
                        searchedAccounts?.map((user: IUser, idx: number) => (
                            <Link href={`/profile/${user._id}`} key={idx}>
                                <div className='flex gap-4 px-2 py-4 cursor-pointer font-semibold rounded border-b-2 border-gray-200'>
                                    <div className='w-[56px] h-[56px]'>
                                        <Image 
                                            width={56}
                                            height={56}
                                            className='rounded-full'
                                            src={user.image}
                                            alt='user-profile'
                                        />
                                    </div>
                                    <div>
                                        <div>
                                            <p className='flex gap-2 items-center lowercase text-lg lg:text-xl font-bold text-primary'>
                                                {user.userName.replaceAll(' ', '_')}
                                                <GoVerified className='text-blue-400 mt-1' />
                                            </p>
                                            <p className=' capitalize text-gray-400 text-sm'>
                                                {user.userName}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <NoResults text={`No Account Results for ${searchTerm}`} />
                    )}
                </div>
            ) : (
                <div className='flex gap-6 md:mt-16 flex-wrap flex-col p-2 cursor-pointer font-semibold'>
                    {videos?.length > 0 ? (
                        videos.map((post: Video, idx: number) => (
                            <VideoCard key={idx} post={post} />
                        ))
                    ) : (
                        <NoResults text={`No Video Results for ${searchTerm}`} />
                    )}
                </div>
            )}
        </div>
    )
}

export const getServerSideProps = async({
    params: { searchTerm }
} : {
    params: { searchTerm: string }
}) => {
    const { data } = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)

    return {
        props: { videos: data }
    }
}


export default Search