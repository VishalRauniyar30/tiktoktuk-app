import React from 'react'
import { useRouter } from 'next/router'
import { BiCommentX } from 'react-icons/bi'

import { MdOutlineVideocamOff } from 'react-icons/md'

interface IProps {
    text: string
}

const NoResults = ({ text } : IProps) => {
    const { pathname } = useRouter()
    const isDetailPage = pathname.includes('/detail/')

    return (
        <div className='flex flex-col justify-center items-center h-full w-full'>
            <p className="text-8xl mb-4">
                {isDetailPage ? (
                    <BiCommentX />
                ) : (
                    <MdOutlineVideocamOff />
                )}
            </p>
            <p className="text-2xl text-center">
                {text}
            </p>
        </div>
    )
}

export default NoResults