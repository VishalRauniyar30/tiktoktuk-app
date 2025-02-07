import React from "react"
import axios from "axios"

import NoResults from "@/components/NoResults"
import VideoCard from "@/components/VideoCard"
import { BASE_URL } from "@/utils"
import { Video } from "@/type"

interface IProps {
    videos: Video[]
}

const Home = ({ videos } : IProps ) => {
    return (
        <div className="flex flex-col gap-10 videos h-full">
            {videos?.length > 0 ? videos?.map((video : Video) => (
                <VideoCard post={video} isShowingOnHome key={video._id} />
            )) : (
                <NoResults text='No Videos' />
            )}
        </div>
    )
}

export const getServerSideProps = async ({
    query: { topic },
} : {
    query : { topic: string }
}) => {
    let response = null
    
    if(topic) {
        response = await axios.get(`${BASE_URL}/api/discover/${topic}`)
    } else {
        response = await axios.get(`${BASE_URL}/api/post`)
    }

    return {
        props : {
            videos: response.data
        }
    }
}

export default Home