import { ProjectInterface } from '@/common.types'
import Button from '@/components/Button'
import Categories from '@/components/Categories'
import LoadMore from '@/components/LoadMore'
import ProjectCard from '@/components/ProjectCard'
import { fetchAllProjects, fetchAllProjectsByCategory } from '@/lib/actions'
import { PiWarningDiamond } from 'react-icons/pi'

type ProjectCollection = {
  projectCollection: {
    edges: { node: ProjectInterface }[]
    pageInfo: {
      hasPreviousPage: boolean
      hasNextPage: boolean
      startCursor: string
      endCursor: string
    }
  }
}

type ProjectSearch = {
  projectSearch: {
    edges: { node: ProjectInterface }[]
    pageInfo: {
      hasPreviousPage: boolean
      hasNextPage: boolean
      startCursor: string
      endCursor: string
    }
  }
}

type Props = {
  searchParams: {
    category?: string
    endcursor?: string
    nextPage?: string
  }
}

interface FetcheProjects {
  projects: [],
  totalProjects: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default async function Home({ searchParams: { category, endcursor, nextPage } }: Props) {

  const {
    projects,
    totalProjects,
    totalPages,
    hasNextPage,
    hasPreviousPage
  } = category ? await fetchAllProjectsByCategory(category) as FetcheProjects : await fetchAllProjects(nextPage) as FetcheProjects

  // console.log(projects)

  // const totalProjects = projects.length
  // const perPage = 4
  // const totalPages = Math.ceil(totalProjects / perPage) 
  // const hasNextPage = nextPage ? parseInt(nextPage) < totalPages : totalPages > 1 ? true : false
  // const hasPreviousPage = nextPage ? parseInt(nextPage) > 1 : false

  // const data = category ? await fetchAllProjectsByCategory(category, nextPage): await fetchAllProjects(endcursor, nextPage)
  // let projectsToDisplay:any = []
  // if ((data as ProjectCollection)?.projectCollection?.edges) {
  //   projectsToDisplay = (data as ProjectCollection)?.projectCollection?.edges 
  // }else if ((data as ProjectSearch)?.projectSearch?.edges) {
  //   projectsToDisplay = (data as ProjectSearch)?.projectSearch.edges
  // }

  //   projectsToDisplay?.sort((a: { node: { updatedAt: string | number | Date } }, b: { node: { updatedAt: string | number | Date } }) => {
  //     const dateA = new Date(a.node.updatedAt) as any;
  //     const dateB = new Date(b.node.updatedAt) as any;
  //     // return dateA - dateB; // Sort ascending
  //     return dateB - dateA; // Sort descending
  // });

  // const pageInfo = (data as ProjectCollection)?.projectCollection?.pageInfo || (data as ProjectSearch)?.projectSearch?.pageInfo

  if (projects?.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <div className=" w-full h-8 bg-yellow-50/30 rounded-md flex items-center justify-center text-yellow-900 my-5">
          <PiWarningDiamond /> &nbsp;&nbsp;
          Note: Few of the Links Does not work! They Might work in Future
        </div>

        <Categories />

        <p className='no-result-text text-center'>Projects not found 😢. Please add some!!</p>
      </section>
    )
  }

  return (
    <section className="flexStart flex-col paddings mb-16">

      <div className=" w-full h-8 py-5 bg-yellow-100 rounded-md border-2 border-yellow-700 flex items-center justify-center text-yellow-900 font-bold my-5">
        <PiWarningDiamond className='font-bold text-lg' /> &nbsp;&nbsp;
        Note: Few of the Links Does not work! They Might work in Future
      </div>

      <Categories />

      <section className="projects-grid">
        {projects.map((node: ProjectInterface, index: number) => {

          return <ProjectCard
            key={index}
            // key={`${node?._id}`}
            id={node?._id}
            image={node?.image}
            title={node?.title}
            name={node?.createdBy.name}
            avatarUrl={node?.createdBy.avatarUrl}
            userId={node?.createdBy._id}
          />
        })}
      </section>

      <LoadMore
        // startCursor={pageInfo.startCursor}
        // endCursor={pageInfo.endCursor}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPreviousPage}
      />
    </section>
  )
}
