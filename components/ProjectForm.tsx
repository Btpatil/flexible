'use client'
import { ProjectInterface, SessionInterface } from "@/common.types"
import Image from "next/image"
import React, { useState } from "react"
import FormField from "./FormField"
import { categoryFilters } from "@/constants"
import CustomMenu from "./CustomMenu"
import Button from "./Button"
import { createNewProject, revalidateThePath, updateProject } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { FormRichTextDescription } from "./FormRichTextDescription"
import axios from "axios"
import { serverurl } from "@/lib/constants"

type Props = {
    type: string,
    session: SessionInterface
    project?: ProjectInterface
}

const ProjectForm = ({ type, session, project }: Props) => {
    const router = useRouter()
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmiting(true)
        setHasError("")

        // const { token } = await fetchToken()
        try {
            if (type === 'create') {
                // const res = await createNewProject(form, session?.user?.id)

                const res = await axios({
                    url: `${serverurl}/api/project`,
                    method: 'post',
                    data: form,
                })

                if (res.status == 200) {
                    await revalidateThePath('/')
                    router.push('/')
                }else{
                    throw new Error(res.data?.error || "Something went wrong")
                }
            }
            if (type === 'edit') {
                const res = await axios({
                    url: `${serverurl}/api/project`,
                    method: 'put',
                    data: {
                        ...form,
                        projectId: project?._id,
                    },
                })
                // const res = await updateProject(form, project?._id as string)

                if (res.status == 200) {
                    await revalidateThePath('/')
                    router.push('/')
                }else{
                    console.log(res.data?.error)
                    throw new Error(res.data?.error || "Something went wrong")
                }
            }
        } catch (err: any) {
            // console.log(err)
            setHasError(err?.response?.data?.error || err?.message || "something went wrong")
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const file = e.target.files?.[0]

        if (!file) {
            return alert('please choose an image')
        }

        if (!file.type.includes('image')) {
            return alert('please choose an image')
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const result = reader.result as string

            handleStateChange('image', result)
        }
    }

    const handleStateChange = (fieldName: string, fieldValue: string) => {
        setForm(prevState => ({
            ...prevState, [fieldName]: fieldValue
        }))
    }
    
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [haserror, setHasError] = useState<string>("")

    const [form, setForm] = useState({
        title: project?.title || '',
        description: project?.description || '',
        image: project?.image || '',
        liveSiteUrl: project?.liveSiteUrl || '',
        githubUrl: project?.githubUrl || '',
        category: project?.category || ''
    })

    return (
        <form
            onSubmit={handleFormSubmit}
            className="flexStart form"
        >
            <div className="flexStart form_image-container">
                <label htmlFor="poster" className="flexCenter form_image-label">
                    {!form.image && 'Choose a Poster for your image'}
                </label>
                <input
                    id="image"
                    type="file"
                    className="form_image-input"
                    accept="image/*"
                    required={type === 'create'}
                    onChange={handleChangeImage}
                />
                {form.image && (
                    <Image
                        src={form?.image}
                        className="sm:p-10 object-contain z-20"
                        alt="poster image"
                        fill
                    />
                )}
            </div>

            <FormField
                title='title'
                state={form.title}
                setState={(value) => handleStateChange('title', value)}
                placeholder='flexible'
            />

            <FormRichTextDescription
                title='description'
                state={form.description}
                // isTextArea={true}
                setState={(value) => handleStateChange('description', value)}
                placeholder='Showcase and Discover your Projects'
            />

            <FormField
                type="url"
                title='Website URL'
                state={form.liveSiteUrl}
                setState={(value) => handleStateChange('liveSiteUrl', value)}
                placeholder='e.g https://techystuff.com'
            />

            <FormField
                type="url"
                title='Github URL'
                state={form.githubUrl}
                setState={(value) => handleStateChange('githubUrl', value)}
                placeholder='e.g https://github.com/Btpatil'
            />

            <CustomMenu
                title='Choose a Category'
                state={form.category}
                setState={(value) => handleStateChange('category', value)}
                filters={categoryFilters}
            />

            <div className="flexStart w-full">
                <Button
                    title={isSubmiting ? type === 'create' ? 'Creating' : 'Editing' : type === 'create' ? 'Create' : 'Edit'}
                    type='submit'
                    leftIcon={isSubmiting ? '' : '/plus.svg'}
                    isSubmiting={isSubmiting}
                />

            </div>
                {
                    haserror !== "" &&
                    <div className=" w-full h-8 py-5 bg-red-100 rounded-md border-2 border-red-700 flex items-center justify-center text-red-900 font-bold my-5">
                        {haserror}
                    </div>
                }
        </form>
    )
}

export default ProjectForm