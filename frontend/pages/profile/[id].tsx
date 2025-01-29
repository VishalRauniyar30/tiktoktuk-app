import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { IUser, Video } from '@/type'
import { BASE_URL } from '@/utils'
import Image from 'next/image';
import { GoVerified } from 'react-icons/go';
import NoResults from '@/components/NoResults';
import VideoCard from '@/components/VideoCard';

interface IProps{
    data: {
        user: IUser;
        userVideos: Video[];
        userLikedVideos: Video[];
    };
}


const Profile = ({ data }: IProps) => {
    const [showUserVideos, setShowUserVideos] = useState<Boolean>(true)
    const [videosList, setVideosList] = useState<Video[]>([])

    const { user, userVideos, userLikedVideos } = data
    
    useEffect(() => {
        const fetchVideos = async () => {
            if(showUserVideos) {
                setVideosList(userVideos)
            } else {
                setVideosList(userLikedVideos)
            }
        }
        fetchVideos()
    }, [showUserVideos, userLikedVideos, userVideos])

    
    return (
        <div className='w-full'>
            <div className='flex gap-6 md:gap-10 mb-4 bg-white w-full'>
                <div className='w-16 h-16 md:w-32 md:h-32'>
                    <Image 
                        src={user.image}
                        width={128}
                        height={128}
                        alt='user-profile'
                        className='rounded-full'
                    />
                </div>
                <div className='flex flex-col justify-center'>
                    <div className='text-base md:text-2xl font-bold tracking-wider flex gap-3 items-center justify-center lowercase'>
                        <span>
                            {user.userName.replace(/\s+/g, '_')}
                        </span>
                        <GoVerified className='text-blue-400 mt-1 md:text-xl text-base' />
                    </div>
                    <p className='text-sm font-medium capitalize mt-1'>
                        {user.userName}
                    </p>
                </div>
            </div>
            <div>
                <div className='flex gap-10 my-10 border-b-2 border-gray-200 bg-white w-full'>
                    <p className={`text-xl font-semibold cursor-pointer mt-2 ${showUserVideos ? 'border-b-2 border-black' : 'text-gray-400'}`} onClick={() => setShowUserVideos(true)}>
                        Videos
                    </p>
                    <p className={`text-xl font-semibold cursor-pointer mt-2 ${!showUserVideos ? 'border-b-2 border-black' : 'text-gray-400'}`} onClick={() => setShowUserVideos(false)}>
                        Liked
                    </p>
                </div>
                <div className='flex gap-6 flex-wrap md:justify-start'>
                    {videosList?.length > 0 ? (
                        videosList.map((post: Video, idx: number) => (
                            <VideoCard key={idx} post={post} />
                        ))
                    ) : (
                        <NoResults text={`No ${showUserVideos ? '' : 'Liked'} Videos Yet`} />
                    )}
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async ({
    params: { id },
  }: {
    params: { id: string }
}) => {
    const res = await axios.get(`${BASE_URL}/api/profile/${id}`)
  
    return {
      props: { data: res.data },
    }
}

export default Profile