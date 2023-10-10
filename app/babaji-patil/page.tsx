import { ProjectInterface, UserProfile } from '@/common.types'
import Modal from '@/components/Modal'
import ProjectCard from '@/components/ProjectCard'
import RelatedProjects from '@/components/RelatedProjects'
import { getUserProjects } from '@/lib/actions'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";

export default async function page() {
    const userId = 'user_01HABVVTVGQP1VKJ3061XD6DFW'
    const result = await getUserProjects(userId) as { user?: UserProfile }
    const filteredProjects = result?.user?.projects?.edges
        ?.filter(({ node }: { node: ProjectInterface }) => node?.id !== null)

    return (
        <Modal>
            <div className="flex justify-center my-2 text-5xl font-extrabold text-slate-500 ">I'm &nbsp;<span className='text-purple-500'>Babaji Patil</span></div>
            <div className=" text-slate-600">Front End Developer | Web Developer</div>
            <section className="flexCenter w-full gap-8 my-10">
                <span className="w-full h-0.5 bg-light-white-200" />
                <Image
                    src={'/myimage.jpeg'}
                    className="rounded-full"
                    width={128}
                    height={128}
                    alt="profile image"
                />
                <span className="w-full h-0.5 bg-light-white-200" />
            </section>

            <section className="w-full ">
                <div className=" text-3xl">Projects</div>
                <section className="projects-grid">
                    {filteredProjects?.map(({ node }: { node: ProjectInterface }) => (
                        <Link href={`/project/${node?.id}`} className="flexCenter group relative w-full h-full">
                            <Image src={node?.image} width={414} height={314} className="w-full h-full object-cover rounded-2xl" alt="project image" />

                            <div className="hidden group-hover:flex related_project-card_title">
                                <p className="w-full">{node?.title}</p>
                            </div>
                        </Link>
                    ))}
                </section>
            </section>

            <section className='flex flex-col items-center mt-20'>
                <div className="flex flex-wrap gap-3">
                    <Link href={'https://www.linkedin.com/in/babajipatil05/'}>
                        <AiFillLinkedin className=' text-4xl' />
                    </Link>
                    <Link href={'https://github.com/Btpatil'}>
                        <AiFillGithub className=' text-4xl' />
                    </Link>
                </div>
            </section>
        </Modal>
    )
}
