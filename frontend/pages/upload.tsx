import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SanityAssetDocument } from '@sanity/client'
import axios from 'axios'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

import useAuthStore from '@/store/authStore'
import { client } from '@/utils/client'
import { topics } from '@/utils/constants'
import { BASE_URL } from '@/utils'

const Upload = () => {
    const [caption, setCaption] = useState('')
    const [topic, setTopic] = useState<String>(topics[0].name)
    const [loading, setLoading] = useState<Boolean>(false)
    const [savingPost, setSavingPost] = useState<Boolean>(false)
    const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>()
    const [wrongFileType, setWrongFileType] = useState<Boolean>(false)

    const { userProfile } : { userProfile: any } = useAuthStore()

    const router = useRouter()

    useEffect(() => {
        if(!userProfile) {
            router.push('/')
        }
    }, [userProfile, router])

    const uploadVideo = async (e : any) => {
        const selectedFile = e.target.files[0]
        const fileTypes = ['video/mp4', 'video/webm', 'video/ogg']

        if(fileTypes.includes(selectedFile.type)) {
            setWrongFileType(false)
            setLoading(true)

            client.assets.upload('file', selectedFile, {
                contentType: selectedFile.type,
                filename: selectedFile.name
            })
            .then((data) => {
                setVideoAsset(data)
                setLoading(false)
            })
        } else {
            setWrongFileType(true)
            setLoading(false)
        }
    }

    const handlePost = async () => {
        if(caption && videoAsset?._id && topic) {
            setSavingPost(true)

            const doc = {
                _type: 'post',
                caption,
                video: {
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: videoAsset?._id
                    },
                },
                userId: userProfile?._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: userProfile?._id
                },
                topic
            }
            await axios.post(`${BASE_URL}/api/post`, doc)

            router.push('/')
        }
    }

    const handleDiscard = () => {
        setSavingPost(false)
        setVideoAsset(undefined)
        setCaption('')
        setTopic('')
    }
    return (
        <div className='flex w-full h-full absolute left-0 top-[60px] lg:top-[81px] mb-10 pt-10 lg:pt-10 bg-[#f8f8f8] justify-center'>
            <div className='bg-white rounded-lg xl:h-[90vh] w-[75%] flex gap-6 flex-wrap justify-between items-center p-14 pt-6'>
                <div>
                    <div className='text-center'>
                        <p className='text-2xl font-bold'>Upload Video</p>
                        <p className='text-base text-gray-400 mt-1'>Post a Video to Your Account</p>
                    </div>
                    <div className='border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-5 h-[450px] w-[450px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100'>
                        {loading ? (
                            <p className='text-center  text-3xl text-red-400 font-semibold'>
                                Uploading...
                            </p>
                        ) : (
                            <div>
                                {!videoAsset ? (
                                    <label className='cursor-pointer'>
                                        <div className='flex flex-col items-center justify-center h-full'>
                                            <div className='flex flex-col justify-center items-center'>
                                                <p className='font-bold text-xl'>
                                                    <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                                                </p>
                                                <p className='text-xl font-semibold'>
                                                    Select Video to Upload
                                                </p>
                                            </div>
                                            <p className='text-gray-400 text-center mt-10 text-sm leading-10'>
                                                MP4 or WebM or ogg <br />
                                                720x1280 resolution or higher <br />
                                                Up to 10 minutes <br />
                                                Less than 2 GB
                                            </p>
                                            <p className='bg-[#f51997] hover:bg-[#8c235e] text-center mt-10 rounded text-white text-base font-medium p-2 w-52 outline-none'>
                                                Select File
                                            </p>
                                        </div>
                                        <input
                                            type="file" 
                                            name='upload-video'
                                            onChange={uploadVideo}
                                            className='w-0 h-0'
                                        />
                                    </label>   
                                ) : (
                                    <div className='rounded-3xl w-[500px] p-4 flex flex-col gap-6 justify-center items-center'>
                                        <video 
                                            src={videoAsset?.url}
                                            controls
                                            loop
                                            className='rounded-xl h-[450px] mt-[60px] bg-black'
                                        ></video>
                                        <div className='flex justify-between items-center gap-20'>
                                            {/* <p className='text-lg'>{videoAsset.originalFilename}</p> */}
                                            <button
                                                type='button'
                                                className='rounded-full bg-gray-200 text-red-400 p-2 text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                                                onClick={() => setVideoAsset(undefined)}
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {wrongFileType && (
                        <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[250px]'>
                            Please Select an Video File (mp4 or webm or ogg)
                        </p>
                    )}
                </div>
                <div className='flex flex-col gap-3 pb-10'>
                    <label className='text-base font-medium'>
                        Caption
                    </label>
                    <input 
                        type="text" 
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}    
                        className='rounded outline-none text-base border-2 border-gray-200 p-2'
                    />
                    <label className='text-base font-medium'>Choose A Category</label>
                    <select
                        onChange={(e) => setTopic(e.target.value)}
                        className='outline-none lg:w-[529px] border-2 border-gray-200 text-base capitalize lg:p-4 p-2 rounded cursor-pointer'
                    >
                        {topics.map((item) => (
                            <option 
                                value={item.name}
                                key={item.name}
                                className='outline-none capitalize bg-white text-gray-700 text-base p-2 hover:bg-slate-300'
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <div className='flex gap-6 mt-10'>
                        <button
                            onClick={handleDiscard}
                            type='button'
                            className='border-gray-300 hover:bg-gray-600 hover:text-white border-2 text-base font-medium p-2 rounded w-28 lg:w-44 outline-none cursor-pointer'
                        >
                            Discard
                        </button>
                        <button
                            disabled={videoAsset?.url ? false : true}
                            onClick={handlePost}
                            type='button'
                            className='bg-[#b61771] text-white hover:bg-[#8c235e] text-base font-medium p-2 rounded w-28 lg:w-44 outline-none cursor-pointer'
                        >
                            {savingPost ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Upload