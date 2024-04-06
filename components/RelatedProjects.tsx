import Link from 'next/link'

import { getUserProjects } from '@/lib/actions'
import { ProjectInterface, SessionInterface, UserProfile } from '@/common.types'
import Image from 'next/image'
import LoadMore from './LoadMore'

interface FetcheProjects {
    projects: [],
    totalProjects: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
}

type Props = {
    user?: SessionInterface
    projectId: string
    nextPage?: string
}

const RelatedProjects = async ({ user, projectId, nextPage }: Props) => {
    const {
        projects,
        totalProjects,
        totalPages,
        hasNextPage,
        hasPreviousPage
    } = await getUserProjects(user?.user.id!, nextPage) as FetcheProjects
    // const filteredProjects = result?.user?.projects
    //     ?.filter((node) => node?._id.toString() !== projectId.toString())

    if (projects?.length === 0) return null;

    return (
        <section className="flex flex-col mt-32 w-full">
            <div className="flexBetween">
                <p className="text-base font-bold">
                    More by {user?.user?.name}
                </p>
                <Link
                    href={`/profile/${user?.user?.id}`}
                    className="text-primary-purple text-base"
                >
                    View All
                </Link>
            </div>

            <div className="related_projects-grid">
                {projects?.map((node: ProjectInterface) => {
                    if (node._id !== projectId) {
                        return (
                            <div key={node._id} className="flexCenter related_project-card drop-shadow-card">
                                <Link href={`/project/${node?._id}`} className="flexCenter group relative w-full h-full">
                                    <Image src={node?.image} width={414} height={314} className="w-full h-full object-cover rounded-2xl" alt="project image" />

                                    <div className="hidden group-hover:flex related_project-card_title">
                                        <p className="w-full">{node?.title}</p>
                                    </div>
                                </Link>
                            </div>
                        )
                    }
                })}
            </div>

            <LoadMore
                // startCursor={pageInfo.startCursor}
                // endCursor={pageInfo.endCursor}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPreviousPage}
            />
        </section>
    )
}

export default RelatedProjects