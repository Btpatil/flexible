'use client'
import { ProjectInterface, SessionInterface } from "@/common.types"
import Image from "next/image"
import React, { useState } from "react"
import FormField from "./FormField"
import { categoryFilters } from "@/constants"
import CustomMenu from "./CustomMenu"
import Button from "./Button"
import { createNewProject, fetchToken, updateProject } from "@/lib/actions"
import { useRouter } from "next/navigation"

type Props = {
    type: string,
    session: SessionInterface
    project?: ProjectInterface
}

const ProjectForm = ({ type, session, project }: Props) => {
    const router = useRouter()
    const handleFormSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmiting(true)

        const {token} = await fetchToken()
        try {
            if (type === 'create') {
                await createNewProject(form, session?.user?.id, token)

                router.push('/')
            }
            if (type === 'edit') {
                await updateProject(form, project?.id as string, token)

                router.push('/')
            }
        } catch (error) {
            console.log(error)
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
        // console.log(form)
    }

    const [isSubmiting, setIsSubmiting] = useState(false)

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

            <FormField
                title='description'
                state={form.description}
                isTextArea={true}
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
        </form>
    )
}

export default ProjectForm