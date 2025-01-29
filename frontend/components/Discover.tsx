import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { topics } from '@/utils/constants'

const Discover: NextPage = () => {
    const router = useRouter()

    const { topic } = router.query

    return (
        <div className='xl:border-b-2 xl:border-gray-200 pb-6'>
            <p className='text-gray-500 font-semibold m-3 mt-4 hidden xl:block'>
                Popular Topics
            </p>
            <div className='flex gap-3 flex-wrap'>
                {topics.map((item) => (
                    <Link href={`/?topic=${item.name}`} key={item.name}>
                        <div className={`xl:border-2 hover:bg-primary px-3 py-2 rounded xl:rounded-full flex items-center gap-2 justify-center cursor-pointer ${topic === item.name ? 'xl:border-[#f51997] text-[#f51997]' : 'xl:border-gray-300 text-black'}`}>
                            <span className='font-bold text-2xl xl:text-base'>
                                {item.icon}
                            </span>
                            <span className='font-medium text-base hidden xl:block capitalize'>
                                {item.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Discover