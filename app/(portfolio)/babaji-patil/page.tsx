import { ProjectInterface, UserProfile } from '@/common.types'
import LoadMore from '@/components/LoadMore'
import Modal from '@/components/Modal'
import Navbar from '@/components/Navbar'
import ProjectCard from '@/components/ProjectCard'
import RelatedProjects from '@/components/RelatedProjects'
import { getUserProjects } from '@/lib/actions'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { FiGithub } from "react-icons/fi";
import { PiLinkedinLogo } from "react-icons/pi";

type PageInfo = {
    hasPreviousPage: boolean
    hasNextPage: boolean
    startCursor: string
    endCursor: string
}

type Props = {
    searchParams: {
        category?: string
        endcursor?: string
        nextPage?: string
    }
}

export default async function page({ searchParams: { category, endcursor, nextPage } }: Props) {
    const userId = 'user_01HABVVTVGQP1VKJ3061XD6DFW'
    const result = await getUserProjects(userId, nextPage) as { user?: UserProfile }
    const filteredProjects = result?.user?.projects?.edges
        ?.filter(({ node }: { node: ProjectInterface }) => node?.id !== null)

    // filteredProjects?.sort((a, b) => {
    //     const dateA = new Date(a.node.updatedAt) as any;
    //     const dateB = new Date(b.node.updatedAt) as any;
    //     // return dateA - dateB; // Sort ascending
    //     return dateB - dateA; // Sort descending
    // });
    // console.log(sortedData)

    const pageInfo = result?.user?.projects?.pageInfo as PageInfo

    return (
        <>
            <nav className='flexBetween navbar'>
                <div className='flex-1 flexCenter gap-10'>
                    {/* <Link href='#'>
                    <Image
                        src='/logo.svg'
                        width={116}
                        height={43}
                        alt='logo'
                    />
                </Link> */}
                    <ul className='xl:flex hidden text-small gap-7'>
                        <Link href={'#intro'}>
                            Intro
                        </Link>

                        <Link href={'#aboutme'}>
                            About Me
                        </Link>

                        <Link href={'#skills'}>
                            My Skills
                        </Link>

                        <Link href={'#projects'}>
                            Projects
                        </Link>
                    </ul>
                </div>
            </nav>

            <section className="flexStart flex-col paddings mb-16">

                <div className="min-h-[80vh] flex min-w-full items-center relative" id='intro'>
                    <div className="absolute z-0 right-0 top-0 h-full">
                        <Image className="w-fit h-full object-contain -z-10 opacity-100 max-lg:opacity-50 max-sm:opacity-10 transition-all ease-in" src={'/projects.gif'} width={400} height={600} alt='jsdjsd' />
                    </div>
                    <div className="h-full w-full z-10">
                        <div className=" text-base font-thin text-gray-100">HEY THERE!!</div>
                        <div className=" m-8"></div>
                        <div className="flex my-2 text-6xl font-extrabold text-black font-mono ">I AM &nbsp;<span className='text-purple-500'>BABAJI PATIL</span></div>
                        <div className=" m-6"></div>
                        <div className=" font-thin text-xl text-gray-100">Front End Developer | Web Developer | Flutter App Developer</div>
                        <div className=" m-6"></div>
                        <div className="flex">
                            <Link href={'https://github.com/Btpatil'}>
                                <FiGithub className='text-3xl mr-3 hover:text-purple-600 hover:scale-125 cursor-pointer' />
                            </Link>
                            <Link href={'https://www.linkedin.com/in/babajipatil05/'}>
                                <PiLinkedinLogo className='text-3xl mx-3 hover:text-purple-600 hover:scale-125 cursor-pointer' />
                            </Link>
                        </div>
                        <div className=" m-6"></div>
                        <Link href="#projects">
                            <button className="flexCenter gap-3 px-4 py-3 text-white bg-black/50  bg-primary-purple rounded-xl text-sm font-medium max-md:w-full disabled:bg-purple-400">See My Work</button>
                        </Link>
                    </div>
                </div>

                <div className=" bg-primary-purple h-1 w-[20%] blur-sm"></div>

                <div className="min-h-[400px] py-12 flex min-w-full items-center max-md:flex-col" id='aboutme'>
                    <div className="flex-[35%] h-full w-full">
                        <div className="flex text-8xl font-extrabold text-black font-mono ">ABOUT</div>
                        <div className="flex text-8xl font-extrabold text-black font-mono ">
                            ME
                        </div>
                    </div>
                    <div className="flex-[35%] h-full w-full">
                        <div className="flex my-2 text-3xl font-extrabold text-black font-mono ">I AM &nbsp;<span className='text-purple-400'>BABAJI PATIL</span></div>
                        <div className=" m-6"></div>
                        I am an Engineering Graduate in Computer Science and Engineering with work experience of 1 year. Looking for
                        a role where I can grow and learn from experienced team members and
                        enhance and grow my skills as Web Developer.
                        <div className="m-6"></div>
                        <Link href={'https://www.canva.com/design/DAFGYxUftcI/-SnY4L2-u2rT9hovxIFPCQ/view?utm_content=DAFGYxUftcI&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink'} target='_blank' className="flexCenter gap-3 px-4 py-3 text-white bg-black/50  bg-primary-purple rounded-xl text-sm font-medium max-md:w-full disabled:bg-purple-400">View My Resume</Link>
                    </div>
                </div>

                <div className=" bg-primary-purple h-1 w-[20%] blur-sm"></div>

                <div className="min-h-[200px] py-16 min-w-full" id='skills'>
                    <div className="h-full w-full mb-8">
                        <div className="flex text-5xl font-extrabold text-black font-mono ">MY SKILLS</div>
                    </div>
                    <div className="flex flex-wrap gap-4 lg:w-[60%]">
                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">HTML</button>

                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">CSS</button>

                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">JAVASCRIPT</button>

                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">TAILWIND</button>

                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">BOOTSTRAP</button>

                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">REACTJS</button>

                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">NEXTJS</button>

                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">FLUTTER</button>

                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">MONGODB</button>

                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">FIREBASE</button>

                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">GRAPHQL</button>

                        <button className="px-4 py-3 text-black bg-gray-50 rounded-xl text-md font-medium">PYTHON</button>

                    </div>
                </div>

                <div className=" bg-primary-purple h-1 w-[20%] blur-sm"></div>

                {/* <section className="flexCenter w-full gap-8 my-10">
                    <span className="w-full h-0.5 bg-light-white-200" />
                    <Image
                        src={'/myimage.jpeg'}
                        className="rounded-full"
                        width={128}
                        height={128}
                        alt="profile image"
                    />
                    <span className="w-full h-0.5 bg-light-white-200" />
                </section> */}

                <section className="min-h-[400px] py-16 min-w-full" id='projects'>
                    <div className="flex text-5xl font-extrabold text-black font-mono ">PROJECTS</div>
                    <section className="projects-grid">
                        {filteredProjects?.map(({ node }: { node: ProjectInterface }) => (
                            <Link href={`/project/${node?.id}`} className="flexCenter group relative w-full h-full ">
                                <Image src={node?.image} width={414} height={314} className="w-full h-full object-cover rounded-2xl border border-black/50" alt="project image" />

                                <div className="hidden group-hover:flex related_project-card_title">
                                    <p className="w-full">{node?.title}</p>
                                </div>
                            </Link>
                        ))}
                    </section>
                    <LoadMore
                        startCursor={pageInfo.startCursor}
                        endCursor={pageInfo.endCursor}
                        hasNextPage={pageInfo.hasNextPage}
                        hasPrevPage={pageInfo.hasPreviousPage}
                    />
                </section>

            </section>
        </>
    )
}
