const user = {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'userName',
            title: 'UserName',
            type: 'string',
        },
        {
            name: "image",
            title: "Image",
            type: "string", // Use "image" type for uploaded assets
        }
    ]
}

export default user