import React, { Dispatch, FormEvent, SetStateAction } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GoVerified } from 'react-icons/go'

import useAuthStore from '@/store/authStore'
import { IUser } from '@/type'
import NoResults from './NoResults'

interface IProps {
    comment: string;
    setComment: Dispatch<SetStateAction<string>>;
    addComment: (e: FormEvent) => void; 
    isPostingComment: Boolean;
    comments: IComment[];
}

interface IComment {
    comment: string;
    length?: number;
    _key: string;
    postedBy: {
        _ref?: string;
        _id?: string
    };
}

const Comments = ({ comment, setComment, addComment, comments, isPostingComment } : IProps) => {
    const { allUsers, userProfile } = useAuthStore()
    
    return (
        <div className='border-t-2 border-gray-200 pt-4 px-10 mt-4 bg-[#f8f8f8] border-b-2 lg:pb-0 pb-[100px]'>
            <div className='overflow-auto lg:h-[360px] pb-28'>
                {comments?.length > 0 ? (
                    comments?.map((item: IComment, idx: number) => (
                        <div key={idx}>
                            {allUsers?.map((user: IUser) => 
                              user._id === (item.postedBy._ref || item.postedBy._id) && (
                                <div className='p-2 items-center pb-4' key={idx}>
                                    <Link href={`/profile/${user._id}`}>
                                        <div className='flex items-start gap-3'>
                                            <div className='w-12 h-12'>
                                                <Image 
                                                    src={user.image}
                                                    alt='user-profile'
                                                    width={48}
                                                    height={48}
                                                    className='rounded-full cursor-pointer'
                                                />
                                            </div>
                                            <p className='flex cursor-pointer gap-2 items-center text-[18px] font-bold leading-6 text-primary'>
                                                {user.userName}{` `}
                                                <GoVerified className='text-blue-400' />
                                            </p>
                                        </div>
                                    </Link>
                                    <div className='-mt-5 ml-[60px] mr-8'>
                                        <p className='text-[16px]'>
                                            {item.comment}
                                        </p>
                                    </div>
                                </div>
                              )  
                            )}
                        </div>
                    ))
                ) : (
                    <div className='capitalize'>
                        <NoResults text='No Comments Yet! Be First to add the comment.' />
                    </div>
                )} 
            </div>
            {userProfile && (
                <div className='absolute bottom-0 left-0 pb-6 px-2 md:px-10'>
                    <form className='flex gap-4' onSubmit={addComment}>
                        <input 
                            value={comment}
                            placeholder='Add Comment...'                            
                            className='bg-[#fff] focus:bg-[#f2f2f2] px-6 py-4 text-base font-medium border-2 w-[600px] md:w-[600px] lg:w-[480px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg'
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button className={`text-base text-gray-200 bg-[#f51997] ${isPostingComment ? 'px-4' : 'px-6'} rounded-lg hover:bg-[#941159] hover:text-white`} onClick={addComment}>
                            {isPostingComment ? 'Commenting' : 'Comment'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Comments