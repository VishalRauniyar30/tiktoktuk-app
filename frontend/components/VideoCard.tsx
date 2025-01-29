import React, { useEffect, useRef, useState } from 'react'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BsFillPauseFill, BsFillPlayFill, BsPlay } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi'
 
import { Video } from '@/type'
import { urlFor } from '@/utils/client'

interface IProps {
    post: Video;
    isShowingOnHome?: boolean
}

const VideoCard: NextPage<IProps> = ({ post, isShowingOnHome }) => {
    
    const [playing, setPlaying] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const [isVideoMuted, setIsVideoMuted] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)

    const onVideoPress = () => {
        if(playing) {
            videoRef?.current?.pause()
            setPlaying(false)
        } else {
            videoRef?.current?.play()
            setPlaying(true)
        }
    }

    useEffect(() => {
        if(videoRef?.current) {
            videoRef.current.muted = isVideoMuted
        }
    }, [isVideoMuted])

    if(!isShowingOnHome) {
        return (
            <div className='rounded-xl p-4 bg-[#d7d7d7] hover:bg-[#bbbbbb] transition-all duration-500 ease-out mb-10'>
                <Link href={`/detail/${post._id}`}>
                    <video 
                        src={post.video.asset.url}
                        loop
                        className='w-[250px] md:w-full rounded-xl cursor-pointer'
                    ></video>
                </Link>
                <div className='flex gap-2 -mt-8 items-center ml-4'>
                    <p className='text-white text-lg font-medium flex gap-1 items-center'>
                        <BsPlay className='text-2xl' />
                        <p className='ml-1'>{post?.likes?.length || 0}</p>
                    </p>
                </div>
                <Link href={`/detail/${post._id}`}>
                    <p className='mt-5 text-base md:text-2xl text-primary cursor-pointer w-210 lg:w-400'>
                        {post.caption}
                    </p>
                </Link>
            </div>
        )
    }
    
    return (
        <div className='flex flex-col border-b-2 border-gray-200 pb-6'>
            <div>
                <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
                    <div className='md:w-16 md:h-16 w-10 h-10'>
                        <Link href={`/profile/${post?.postedBy?._id}`}>
                            <>
                                <Image 
                                    src={post.postedBy.image}
                                    alt='user-profile'
                                    width={62}
                                    height={62}
                                    className='rounded-full'
                                    // layout='responsive'
                                    style={{ width: 'auto', height : 'auto' }}
                                />
                            </>
                        </Link>
                    </div>
                    <div>
                        <Link href={`/profile/${post?.postedBy?._id}`}>
                            <div className='flex items-center gap-2'>
                                <p className='flex gap-2 items-center md:text-base font-bold text-primary'>
                                    {post?.postedBy?.userName}{' '}
                                    <GoVerified className='text-blue-400 text-base' />
                                </p>
                                <p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>
                                    {post?.postedBy?.userName}
                                </p>
                            </div>
                        </Link>
                        <Link href={`/detail/${post._id}`}>
                            <p className='my-1 font-normal lg:text-xl md:text-base text-sm'>
                                {post.caption}
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='lg:ml-20 flex gap-4 relative'>
                <div 
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    className='rounded-3xl'
                >
                    <Link href={`/detail/${post._id}`}>
                        <video 
                            src={post.video.asset.url}
                            loop
                            ref={videoRef}
                            className='lg:w-[600px] h-[300px] md:w-[500px] md:h-[400px] lg:h-[530px] w-[400px] rounded-2xl cursor-pointer bg-gray-100'
                        ></video>
                    </Link>
                    {isHover && (
                        <div className='absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[600px] p-3'>
                            {playing ? (
                                <button onClick={onVideoPress}>
                                    <BsFillPauseFill className='text-black text-2xl lg:text-4xl' />
                                </button>
                            ) : (
                                <button onClick={onVideoPress}>
                                    <BsFillPlayFill className='text-black text-2xl lg:text-4xl' />
                                </button>
                            )}
                            {isVideoMuted ? (
                                <button onClick={() => setIsVideoMuted(false)}>
                                    <HiVolumeOff className='text-black text-2xl lg:text-4xl' />
                                </button>
                            ) : (
                                <button onClick={() => setIsVideoMuted(true)}>
                                    <HiVolumeUp className='text-black text-2xl lg:text-4xl' />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VideoCard