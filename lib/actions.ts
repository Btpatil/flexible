import { ProjectForm } from "@/common.types";
import { createProjectMutation, createUserQuery, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsByCateforyAndEndcursorQuery, projectsByCategoryQuery, projectsByEndcursorQuery, projectsQuery, updateProjectMutation } from "@/graphql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === 'production'

// const apiurl = isProduction ? process.env.NEXT_GRAFBASE_API_ENDPOINT || '' : 'http://127.0.0.1:4000/graphql'

const apiurl = 'https://flexible-main-btpatil.grafbase.app/graphql'

// const apikey = isProduction ? process.env.NEXT_API_KEY || '' : '1234'
const getApiKey = () => {
    const apikey = process.env.NEXT_API_KEY
    return apikey
}
const apikey = getApiKey()!

const serverurl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000'

const client = new GraphQLClient(apiurl)

const makeGraphQlRequest = async (query: string, variables = {}) => {
    try {
        return await client.request(query, variables)
    } catch (error: any) {
        console.log(error)
    }
}

export const getUser = (email: string) => {
    client.setHeader('x-api-key', apikey)
    return makeGraphQlRequest(getUserQuery, { email })
}

export const createUser = (name: string, avatarUrl: string, email: string) => {
    client.setHeader('x-api-key', apikey)

    const variables = {
        input: {
            name, email, avatarUrl
        }
    }
    return makeGraphQlRequest(createUserQuery, variables)
}

export const fetchToken = async () => {
    try {
        const res = await fetch(`${serverurl}/api/auth/token`)
        return res.json()
    } catch (error) {
        throw error
    }
}
export const uploadImage = async (img: string) => {
    try {
        const res = await fetch(`${serverurl}/api/upload`, {
            method: 'POST',
            body: JSON.stringify({ path: img })
        })

        return res.json()
    } catch (error) {
        throw error
    }
}

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
    const imageUrl = await uploadImage(form.image)
    if (imageUrl.url) {
        client.setHeader('Authorization', `Bearer ${token}`)
        const variables = {
            input: {
                ...form,
                image: imageUrl.url,
                createdBy: {
                    link: creatorId
                }
            }
        }

        return makeGraphQlRequest(createProjectMutation, variables)
    }
}

export const fetchAllProjectsByCategory = async (category?: string, numberOfProects?: string) => {
    let n = numberOfProects == undefined ? 4 : parseInt(numberOfProects!)*4

    client.setHeader("x-api-key", apikey)
    if(category) return makeGraphQlRequest(projectsByCategoryQuery, {n, category})
};

export const fetchAllProjects = async (endcursor?: string, numberOfProects?: string) => {
    let n = numberOfProects == undefined ? 4 : parseInt(numberOfProects!)*4

    client.setHeader("x-api-key", apikey);
    if(!endcursor) return makeGraphQlRequest(projectsQuery, {n});
    // else if(category && !endcursor) return makeGraphQlRequest(projectsByCategoryQuery, {category})
    // else if(!category && endcursor) {
    //     const data = await makeGraphQlRequest(projectsByEndcursorQuery, {endcursor})
    //     console.log(data)
    //     return makeGraphQlRequest(projectsByEndcursorQuery, {endcursor})
    // }
    // else if(category && endcursor) return makeGraphQlRequest(projectsByCateforyAndEndcursorQuery, {category, endcursor})

};

export const getProjectDetails = (id: string) => {
    client.setHeader("x-api-key", apikey);

    return makeGraphQlRequest(getProjectByIdQuery, { id });
};

export const getUserProjects = (id: string, numberOfProects?: string) => {
    client.setHeader("x-api-key", apikey);
    let n = numberOfProects == undefined ? 4 : parseInt(numberOfProects!)*4

    return makeGraphQlRequest(getProjectsOfUserQuery, { id, n });
};


export const deleteProject = (id: string, token: number) => {
    client.setHeader('Authorization', `Bearer ${token}`)

    return makeGraphQlRequest(deleteProjectMutation, { id });
};

export const updateProject = async (form: ProjectForm, projectId: string, token: number) => {

    function isBase64DataUrl(value: string){
        const base64Regex = /^data:image\/[a-z]+;base64,/
        return base64Regex.test(value)
    }
    let updatedForm = {...form}
    const isUploadingNewImage = isBase64DataUrl(form.image)
    console.log(isUploadingNewImage)
    if (isUploadingNewImage) {
        const imageUrl = await uploadImage(form.image)

        if (imageUrl.url) {
            updatedForm = {
                ...form,
                image: imageUrl.url
            }
        }
    }

    const variables = {
        id: projectId,
        input: updatedForm
    }

    client.setHeader('Authorization', `Bearer ${token}`)

    return makeGraphQlRequest(updateProjectMutation, variables);
};