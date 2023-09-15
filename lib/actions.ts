import { ProjectForm } from "@/common.types";
import { createProjectMutation, createUserQuery, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsByCateforyAndEndcursorQuery, projectsByCategoryQuery, projectsByEndcursorQuery, projectsQuery, updateProjectMutation } from "@/graphql";
import { GraphQLClient } from "graphql-request";
import { json } from "node:stream/consumers";

const isProduction = process.env.NODE_ENV === 'production'

const apiurl = isProduction ? process.env.NEXT_GRAFBASE_API_ENDPOINT || '' : 'http://127.0.0.1:4000/graphql'

const apikey = isProduction ? process.env.NEXT_API_KEY || '' : '1234'

const serverurl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000'

const client = new GraphQLClient(apiurl)

const makeGraphQlRequest = async (query: string, variables = {}) => {
    try {
        return await client.request(query, variables)
    } catch (error) {
        throw error
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

export const fetchAllProjects = (category?: string, endcursor?: string) => {
    client.setHeader("x-api-key", apikey);
    if(!category && !endcursor) return makeGraphQlRequest(projectsQuery);
    if(category && !endcursor) return makeGraphQlRequest(projectsByCategoryQuery, {category})
    if(!category && endcursor) return makeGraphQlRequest(projectsByEndcursorQuery, {endcursor})
    if(category && endcursor) return makeGraphQlRequest(projectsByCateforyAndEndcursorQuery, {category, endcursor})

};

export const getProjectDetails = (id: string) => {
    client.setHeader("x-api-key", apikey);

    return makeGraphQlRequest(getProjectByIdQuery, { id });
};

export const getUserProjects = (id: string, last?: number) => {
    client.setHeader("x-api-key", apikey);

    return makeGraphQlRequest(getProjectsOfUserQuery, { id, last });
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