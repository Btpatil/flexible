import { getconnectionToMongoDB } from "@/lib/connection";
import { serverurl } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";
import Project from "@/models/Project";
import User from "@/models/User";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
    try {
        const {
            title,
            description,
            image,
            liveSiteUrl,
            githubUrl,
            category
        } = await req.json()

        const imageUpload = await axios({
            url: `${serverurl}/api/upload`,
            method: 'POST',
            data: { path: image }
        })

        const imageUploadData = await imageUpload.data
        if (!imageUploadData?.url) throw new Error(imageUploadData?.message)


        const imageUrl = imageUploadData.url

        // console.log(imageUrl)

        if (imageUrl) {

            await getconnectionToMongoDB()

            const currentUser = await getCurrentUser()

            if (currentUser?.user.id) {

                const formdata = {
                    title,
                    description,
                    image,
                    liveSiteUrl,
                    githubUrl,
                    category,
                    createdBy: currentUser?.user.id
                }

                const newProject = await Project.create(formdata);


                // console.log(newProject)

                await User.findByIdAndUpdate(currentUser?.user.id, {
                    $push: {
                        projects: newProject._id
                    }
                })

                return NextResponse.json({
                    message: 'success'
                }, { status: 200 })
            }
            else {
                throw new Error("Something went wrong. Please check if you are logged in and try again!!")
            }
        }
        else {
            throw new Error("Image could not upload: please try again")
        }
    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: 500 })
    }
}


export async function PUT(req: Request, res: NextApiResponse) {

    function isBase64DataUrl(value: string) {
        const base64Regex = /^data:image\/[a-z]+;base64,/
        return base64Regex.test(value)
    }


    try {
        const {
            title,
            description,
            image,
            liveSiteUrl,
            githubUrl,
            category,
            projectId
        } = await req.json()

        let formdata = {
            title,
            description,
            image,
            liveSiteUrl,
            githubUrl,
            category,
        }

        const isUploadingNewImage = isBase64DataUrl(image)

        if (isUploadingNewImage) {
            const imageUpload = await axios({
                url: `${serverurl}/api/upload`,
                method: 'POST',
                data: { path: image }
            })

            const imageUploadData = await imageUpload.data

            if (!imageUploadData?.url) throw new Error(imageUploadData?.message)

            if (imageUploadData.url) {
                formdata = {
                    ...formdata,
                    image: imageUploadData.url
                }
            }
        } else {
            formdata = {
                ...formdata
            }
        }


        await getconnectionToMongoDB()

        const updateProject = await Project.findByIdAndUpdate(projectId, formdata);

        return NextResponse.json({
            message: 'success'
        }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({ error: error?.message }, { status: 500 })
    }
}
