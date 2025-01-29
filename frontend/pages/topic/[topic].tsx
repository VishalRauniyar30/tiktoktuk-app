import React from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import NoResults from '@/components/NoResults'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/type'
import { BASE_URL } from '@/utils'

const Topic = ({ topicVideos }: { topicVideos: Video[] }) => {
    const router = useRouter()
    const { topic }: any = router.query  
    return (
        <div className='w-full'>
            <div className='flex gap-4 flex-col p-2 cursor-pointer font-semibold'>
                {topicVideos?.length > 0 ? (
                    topicVideos.map((post: Video, idx: number) => (
                        <VideoCard key={idx} post={post} />
                    ))
                ) : (
                    <div className='capitalize'>
                        <NoResults text={`No Video Results for category ${topic}`} />
                    </div>
                )}
            </div>
        </div>
    )
}

export const getServerSideProps = async({
    params: { topic }
} : {
    params: { topic: string }
}) => {
    const { data } = await axios.get(`${BASE_URL}/api/topic/${topic}`)

    return {
        props: { topicVideos: data }
    }
}

export default Topic