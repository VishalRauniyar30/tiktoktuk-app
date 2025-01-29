import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId : process.env.NEXT_PUBLIC_SANITY_ID,
    dataset: 'production',
    apiVersion: '2022-03-10',
    useCdn: false,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
})

const builder = imageUrlBuilder(client)

export const urlFor = (src : any) => builder.image(src)

