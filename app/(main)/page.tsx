import { ProjectInterface } from '@/common.types'
import Button from '@/components/Button'
import Categories from '@/components/Categories'
import LoadMore from '@/components/LoadMore'
import ProjectCard from '@/components/ProjectCard'
import { fetchAllProjects, fetchAllProjectsByCategory } from '@/lib/actions'

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

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default async function Home({searchParams: {category, endcursor, nextPage}}: Props) {
  const data = category ? await fetchAllProjectsByCategory(category, nextPage): await fetchAllProjects(endcursor, nextPage)
  let projectsToDisplay:any = []
  if ((data as ProjectCollection)?.projectCollection?.edges) {
    projectsToDisplay = (data as ProjectCollection)?.projectCollection?.edges 
  }else if ((data as ProjectSearch)?.projectSearch?.edges) {
    projectsToDisplay = (data as ProjectSearch)?.projectSearch.edges
  }

//   projectsToDisplay?.sort((a: { node: { updatedAt: string | number | Date } }, b: { node: { updatedAt: string | number | Date } }) => {
//     const dateA = new Date(a.node.updatedAt) as any;
//     const dateB = new Date(b.node.updatedAt) as any;
//     // return dateA - dateB; // Sort ascending
//     return dateB - dateA; // Sort descending
// });

  const pageInfo = (data as ProjectCollection)?.projectCollection?.pageInfo || (data as ProjectSearch)?.projectSearch?.pageInfo

  if (projectsToDisplay.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />

        <p className='no-result-text text-center'>Projects not found 😢. Please add some!!</p>
      </section>
    )
  }

  return (
    <section className="flexStart flex-col paddings mb-16">
      <Categories />

      <section className="projects-grid">
        {projectsToDisplay.map(({ node }: { node: ProjectInterface }) => (
          <ProjectCard
            key={`${node?.id}`}
            id={node?.id}
            image={node?.image}
            title={node?.title}
            name={node?.createdBy.name}
            avatarUrl={node?.createdBy.avatarUrl}
            userId={node?.createdBy.id}
          />
        ))}
      </section>

      <LoadMore 
      startCursor={pageInfo.startCursor}
      endCursor={pageInfo.endCursor}
      hasNextPage={pageInfo.hasNextPage}
      hasPrevPage={pageInfo.hasPreviousPage}
      />
    </section>
  )
}
