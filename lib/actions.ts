'use server'
import { ProjectForm, UserProfile, UserType } from "@/common.types";
// import { createProjectMutation, createUserQuery, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsByCateforyAndEndcursorQuery, projectsByCategoryQuery, projectsByEndcursorQuery, projectsQuery, updateProjectMutation } from "@/graphql";
// import { GraphQLClient } from "graphql-request";
import User from '@/models/User'
import ProjectModel from "@/models/Project";
import { getconnectionToMongoDB } from "./connection";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { serverurl } from "./constants";

// const apiurl = isProduction ? process.env.NEXT_GRAFBASE_API_ENDPOINT || '' : 'http://127.0.0.1:4000/graphql'



// const apikey = isProduction ? process.env.NEXT_API_KEY || '' : '1234'
// const getApiKey = () => {
//     const apikey = process.env.NEXT_API_KEY
//     return apikey
// }
// const apikey = getApiKey()!



// const client = new GraphQLClient(apiurl)

// const makeGraphQlRequest = async (query: string, variables = {}) => {
//     try {
//         return await client.request(query, variables)
//     } catch (error: any) {
//         console.log(error)
//     }
// }

export const getUser = async (email: string) => {
    // depricated Grafbase code
    // client.setHeader('x-api-key', apikey)
    // return makeGraphQlRequest(getUserQuery, { email })

    // new mongo connection
    try {
        getconnectionToMongoDB()
        const user = await User.findOne({ email: email });
        return user
    } catch (error: any) {
        throw new Error("Some Error occured" + error.message)
        // return null
    }

}

export const createUser = async (name: string, avatarUrl: string, email: string) => {
    // depricated Grafbase code
    // client.setHeader('x-api-key', apikey)

    // const variables = {
    //     input: {
    //         name, email, avatarUrl
    //     }
    // }
    // return makeGraphQlRequest(createUserQuery, variables)

    try {
        await getconnectionToMongoDB()

        const newUser = new User({
            name,
            email,
            avatarUrl
        });

        const saveUser = await newUser.save()
        // console.log(saveUser)
        return saveUser;

    } catch (error: any) {
        throw new Error(`Some problem occured while creating User! ${error.message}`)
    }
}

// export const fetchToken = async () => {
//     try {
//         const res = await fetch(`${serverurl}/api/auth/token`)
//         return res.json()
//     } catch (error) {
//         throw error
//     }
// }

export const uploadImage = async (img: string) => {
    try {
        // const res = await axios({
        //     url: `${serverurl}/api/upload`,
        //     method: 'POST',
        //     data: {
        //         path: img
        //     }
        // })
        console.log("line 99", img)
        const res = await fetch(`${serverurl}/api/upload`, {
            method: 'POST',
            body: JSON.stringify({ path: img })
        })

        // const data = res.data
        const text = await res.text()
        console.log(text)
        const data = await res.json()
        if(!data?.url) throw new Error(data?.message)
        return data
    } catch (error: any) {
        throw new Error("Could not upload the image ", error.message)
    }
}

export const createNewProject = async (form: ProjectForm, creatorId: string) => {

    // depricted db
    // if (imageUrl.url) {
    //     client.setHeader('Authorization', `Bearer ${token}`)
    //     const variables = {
    //         input: {
    //             ...form,
    //             image: imageUrl.url,
    //             createdBy: {
    //                 link: creatorId
    //             }
    //         }
    //     }

    //     return makeGraphQlRequest(createProjectMutation, variables)
    // }


    // new mongodb 
    try {
        const imageUrl = await uploadImage(form.image)
        console.log(imageUrl)
        if (imageUrl.url) {
            const data = {
                ...form,
                image: imageUrl.url,
                createdBy: creatorId
            }

            console.log(data)

            await getconnectionToMongoDB()

            const formdata = {
                title: data.title,
                description: data.description,
                image: data.image,
                liveSiteUrl: data.liveSiteUrl,
                githubUrl: data.githubUrl,
                category: data.category,
                createdBy: data.createdBy
            }

            const newProject = await ProjectModel.create(formdata);


            console.log(newProject)

            await User.findByIdAndUpdate(creatorId, {
                $push: {
                    projects: newProject._id
                }
            })

            revalidatePath('/')
            
            return {...formdata, _id: newProject._id.toString()}
        }
    } catch (error: any) {
        throw new Error(`Some problem occured while adding your Work Details! ${error.message}`)
    }

    return null
}

export const fetchAllProjectsByCategory = async (category?: string, p?: string) => {
    // new
    const page = p ? parseInt(p) : 1
    const perPage = 8
    const skip = page ? (page - 1) * perPage : 0

    try {
        await getconnectionToMongoDB()

        const totalProjects = await ProjectModel.where({
            category: category
        }).countDocuments()
        const totalPages = Math.ceil(totalProjects / perPage)

        const projects = await ProjectModel
            .find({
                category,
            })
            .sort({
                updatedAt: 'desc',
            })
            .skip(skip)
            .limit(perPage)
            .populate('createdBy')
            .lean()
            .exec()

        const hasNextPage = page ? page < totalPages : totalPages > 1 ? true : false
        const hasPreviousPage = page ? page > 1 : false

        return {
            projects,
            totalProjects,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }
    } catch (error) {
        // throw new Error("Failed to fetch the Projects")
        console.log(error)
    }

    // deprecated
    // let n = numberOfProects == undefined ? 4 : parseInt(numberOfProects!) * 4

    // client.setHeader("x-api-key", apikey)
    // if (category) return makeGraphQlRequest(projectsByCategoryQuery, { n, category })
};

export const fetchAllProjects = async (p?: string) => {
    // let n = numberOfProects == undefined ? 4 : parseInt(numberOfProects!) * 4
    const page = p ? parseInt(p) : 1
    const perPage = 8
    const skip = page ? (page - 1) * perPage : 0

    try {
        await getconnectionToMongoDB()

        const totalProjects = await ProjectModel.countDocuments()
        const totalPages = Math.ceil(totalProjects / perPage)

        const projects = await ProjectModel
            .find()
            .sort({
                updatedAt: 'desc',
            })
            .skip(skip)
            .limit(perPage)
            .populate('createdBy')
            .lean()
            .exec()

        const hasNextPage = page ? page < totalPages : totalPages > 1 ? true : false
        const hasPreviousPage = page ? page > 1 : false

        return {
            projects,
            totalProjects,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }
    } catch (error) {
        // throw new Error("Failed to fetch the Projects")
        console.log(error)
    }

    // client.setHeader("x-api-key", apikey);
    // if (!endcursor) return makeGraphQlRequest(projectsQuery, { n });
    // else if(category && !endcursor) return makeGraphQlRequest(projectsByCategoryQuery, {category})
    // else if(!category && endcursor) {
    //     const data = await makeGraphQlRequest(projectsByEndcursorQuery, {endcursor})
    //     console.log(data)
    //     return makeGraphQlRequest(projectsByEndcursorQuery, {endcursor})
    // }
    // else if(category && endcursor) return makeGraphQlRequest(projectsByCateforyAndEndcursorQuery, {category, endcursor})

};

export const getProjectDetails = async (id: string) => {
    // new

    try {
        await getconnectionToMongoDB()

        const project = await ProjectModel
            .findById(id)
            .populate('createdBy')
            .exec()

        return { project }
    } catch (error) {
        // throw new Error("Failed to fetch the Projects")
        console.log(error)
    }

    // deprecated
    // client.setHeader("x-api-key", apikey);

    // return makeGraphQlRequest(getProjectByIdQuery, { id });
};

export const getProjectForEditingDetails = async (id: string) => {
    // new

    try {
        await getconnectionToMongoDB()

        const project = await ProjectModel
            .findById(id)

        return { project }
    } catch (error) {
        // throw new Error("Failed to fetch the Projects")
        console.log(error)
    }

    // deprecated
    // client.setHeader("x-api-key", apikey);

    // return makeGraphQlRequest(getProjectByIdQuery, { id });
};

export const getUserProjects = async (id: string, numberOfProects?: string) => {
    // new
    try {
        await getconnectionToMongoDB()

        const user = await User
            .findById(id)
            .populate('projects')
            .exec()

        return { user }
    } catch (error) {
        // throw new Error("Failed to fetch the Projects")
        console.log(error)
    }

    // deprecated
    // client.setHeader("x-api-key", apikey);
    // let n = numberOfProects == undefined ? 4 : parseInt(numberOfProects!) * 4

    // return makeGraphQlRequest(getProjectsOfUserQuery, { id, n });
};


export const deleteProject = async (id: string, userId: string) => {
    // new
    try {
        await getconnectionToMongoDB()

        const deletedProject = await ProjectModel
            .findByIdAndDelete(id)

        console.log(deletedProject)

        if (!deleteProject) {
            throw new Error("Project not found or Already daleted")
        }

        await User.findByIdAndUpdate(userId, {
            $pull: {
                projects: id
            }
        })

        revalidatePath('/')


    } catch (error) {
        throw new Error("Failed to delete the Project")
        // console.log(error)
    }

    // deprecated
    // client.setHeader('Authorization', `Bearer ${token}`)

    // return makeGraphQlRequest(deleteProjectMutation, { id });
};

export const updateProject = async (form: ProjectForm, projectId: string) => {
    
    // new mongodb 
    function isBase64DataUrl(value: string) {
        const base64Regex = /^data:image\/[a-z]+;base64,/
        return base64Regex.test(value)
    }

    try {    
        let updatedForm = { ...form }
    
        const isUploadingNewImage = isBase64DataUrl(form.image)
    
        // console.log(isUploadingNewImage)
    
        if (isUploadingNewImage) {
            const imageUrl = await uploadImage(form.image)
    
    
            if (imageUrl.url) {
                updatedForm = {
                    ...form,
                    image: imageUrl.url
                }
            }
        } else {
            updatedForm = {
                ...form
            }
        }

        await getconnectionToMongoDB()

        const updateProject = await ProjectModel.findByIdAndUpdate(projectId, {
            title: updatedForm.title,
            description: updatedForm.description,
            image: updatedForm.image,
            liveSiteUrl: updatedForm.liveSiteUrl,
            githubUrl: updatedForm.githubUrl,
            category: updatedForm.category,
            // createdBy: updatedForm.createdBy
        });

        // await User.findByIdAndUpdate(creatorId, {
        //     $push: {
        //         projects: newProject._id
        //     }
        // })

        revalidatePath('/')

        return updateProject

    } catch (error: any) {
        throw new Error(`Some problem occured while adding your Work Details! ${error.message}`)
    }

    return null
}

export const revalidateThePath = async (path:string) => {
    revalidatePath(path)
}

// const variables = {
//     id: projectId,
//     input: updatedForm
// }

// client.setHeader('Authorization', `Bearer ${token}`)

// return makeGraphQlRequest(updateProjectMutation, variables);

// return null
// }