import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { BsFillPlayFill } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go'
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi'
import { MdOutlineCancel } from 'react-icons/md'

import Comments from '@/components/Comments'
import LikeButton from '@/components/LikeButton'
import useAuthStore from '@/store/authStore'
import { Video } from '@/type'
import { BASE_URL } from '@/utils'

interface IProps {
    postDetails: Video
}

const PostDetail = ({ postDetails }: IProps) => {
    const [post, setPost] = useState(postDetails)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false)
    const [isPostingComment, setIsPostingComment] = useState<boolean>(false)
    const [comment, setComment] = useState<string>('')

    const videoRef = useRef<HTMLVideoElement>(null)
    const router = useRouter()

    const { userProfile } : any = useAuthStore()

    const onVideoClick = () => {
        if(isPlaying) {
            videoRef?.current?.pause()
            setIsPlaying(false)
        } else {
            videoRef?.current?.play()
            setIsPlaying(true)
        }
    }

    useEffect(() => {
        if(post && videoRef?.current) {
            videoRef.current.muted = isVideoMuted
        }
    }, [post, isVideoMuted])

    const handleLike = async (like : boolean) => {
        if(userProfile) {
            const res = await axios.put(`${BASE_URL}/api/like`, {
                userId: userProfile?._id,
                postId: post._id,
                like
            })
            setPost({ ...post, likes: res.data.likes })
        }
    }

    const addComment = async (e: { preventDefault: () => void }) => {
        e.preventDefault()

        if(userProfile && comment) {
            setIsPostingComment(true)
            
            const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
                userId: userProfile._id,
                comment
            })

            setPost({ ...post, comments: data.comments })
            setComment('')
            setIsPostingComment(false)
        }
    }
    
    return (
        <>
            {post && (
                <div className='flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap h-screen overflow-y-auto'>
                    <div className='relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black'>
                        <div className='opacity-90 absolute top-6 left-2 lg:left-6 flex gap-6 z-50'>
                            <p className='cursor-pointer' onClick={() => router.back()}>
                                <MdOutlineCancel className='text-white text-[35px] hover:opacity-90' />
                            </p>
                        </div>
                        <div className="relative">
                            <div className='lg:h-[100vh] h-[60vh]'>
                                <video 
                                    src={post?.video?.asset?.url}
                                    ref={videoRef}
                                    loop
                                    onClick={onVideoClick}
                                    className='h-full cursor-pointer'
                                ></video>
                            </div>
                            <div className='absolute top-[45%] left-[45%] cursor-pointer'>
                                {!isPlaying && (
                                    <button onClick={onVideoClick}>
                                        <BsFillPlayFill className='text-white text-6xl lg:text-8xl' />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className='absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer'>
                            {isVideoMuted ? (
                                <button onClick={() => setIsVideoMuted(false)}>
                                    <HiVolumeOff className='text-white text-3xl lg:text-4xl' />
                                </button>
                            ) : (
                                <button onClick={() => setIsVideoMuted(true)}>
                                    <HiVolumeUp className='text-white text-3xl lg:text-4xl' />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className='relative w-[1000px] md:w-[900px] lg:w-[700px] h-screen overflow-y-auto'>
                        <div className='lg:mt-20 mt-10'>
                            <Link href={`/profile/${post.postedBy._id}`}>
                                <div className='flex gap-4 mb-4 bg-white w-full pl-10 cursor-pointer'>
                                    <Image 
                                        src={post.postedBy.image}
                                        alt='user-profile'
                                        width={60}
                                        height={60}
                                        className='rounded-full'
                                    />
                                    <div>
                                        <div className='text-xl font-bold lowercase tracking-wider flex gap-2 items-center justify-center'>
                                            {post.postedBy.userName.replace(/\s+/g, '_')}{' '}
                                            <GoVerified className='text-blue-400 text-xl' />
                                        </div>
                                        <p className='text-base'>
                                            {post.postedBy.userName}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            <div className="px-10">
                                <p className='text-xl text-gray-600'>
                                    {post.caption}
                                </p>
                            </div>
                            <div className='mt-10 px-10'>
                                {userProfile && (
                                    <LikeButton
                                        likes={post.likes}
                                        flex='flex'
                                        handleLike={() => handleLike(true)}
                                        handleDislike={() => handleLike(false)}
                                    />
                                )}
                            </div>
                            <Comments 
                                comment={comment}
                                setComment={setComment}
                                addComment={addComment}
                                comments={post.comments}
                                isPostingComment={isPostingComment}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


export const getServerSideProps = async ({ 
    params: { id }, 
} : { 
    params: { id: string } 
}) => {
    const { data } = await axios.get(`${BASE_URL}/api/post/${id}`)
    
    return {
        props: {
            postDetails: data
        }
    }
}

export default PostDetail