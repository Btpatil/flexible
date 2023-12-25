export const getUserQuery = `
query User($email: String!) {
    user(by: {email: $email}) {
        name
        email
        avatarUrl
        description
        githubUrl
        linkedinUrl
        id
    }
  }
`
export const updateProjectMutation = `
	mutation UpdateProject($id: ID!, $input: ProjectUpdateInput!) {
		projectUpdate(by: { id: $id }, input: $input) {
			project {
				id
				title
				description
				createdBy {
					email
					name
				}
			}
		}
	}
`;

export const deleteProjectMutation = `
  mutation DeleteProject($id: ID!) {
    projectDelete(by: { id: $id }) {
      deletedId
    }
  }
`;

export const createUserQuery = `
mutation UserCreate($input: UserCreateInput!) {
    userCreate(input: $input) {
      user {
        name
        email
        avatarUrl
        description
        githubUrl
        linkedinUrl
        id
      }
    }
  }
`

export const createProjectMutation = `
  mutation CreateProject($input: ProjectCreateInput!){
    projectCreate(input: $input) {
      project {
        id
        title
        description
        createdBy {
          name
          email
        }
      }
    }
  }
`


export const projectsQuery = `
query ProjectCollection($n: Int) {
  projectCollection(first: $n, orderBy: {createdAt:DESC}) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        title
        githubUrl
        description
        liveSiteUrl
        id
        image
        category
        updatedAt
        createdBy {
          id
          email
          name
          avatarUrl
        }
      }
    }
  }
}
`;

export const projectsByCategoryQuery = `
  query getProjects($n: Int, $category: String) {
    projectSearch(first: $n, filter: {category: {eq: $category}}) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          title
          githubUrl
          description
          liveSiteUrl
          id
          image
          category
          updatedAt
          createdBy {
            id
            email
            name
            avatarUrl
          }
        }
      }
    }
  }
`;

export const projectsByEndcursorQuery = `
  query getProjects($endCursor: String) {
    projectSearch(first: 8, after:$endCursor ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          title
          githubUrl
          description
          liveSiteUrl
          id
          image
          category
          createdBy {
            id
            email
            name
            avatarUrl
          }
        }
      }
    }
  }
`;

export const projectsByCateforyAndEndcursorQuery = `
  query getProjects($category:String, $endCursor: String) {
    projectSearch(first: 8, after:$endCursor, filter: {category: {eq: $category}}) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          title
          githubUrl
          description
          liveSiteUrl
          id
          image
          category
          createdBy {
            id
            email
            name
            avatarUrl
          }
        }
      }
    }
  }
`;

export const getProjectByIdQuery = `
  query GetProjectById($id: ID!) {
    project(by: { id: $id }) {
      id
      title
      description
      image
      liveSiteUrl
      githubUrl
      category
      createdBy {
        id
        name
        email
        avatarUrl
      }
    }
  }
`;

export const getProjectsOfUserQuery = `
  query getUserProjects($id: ID!, $n: Int) {
    user(by: { id: $id }) {
      id
      name
      email
      description
      avatarUrl
      githubUrl
      linkedinUrl
      projects(first: $n, orderBy: {createdAt: DESC}) {
        edges {
          node {
            id
            title
            image
            updatedAt
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

/*
export const projectsQuery = `
  query getProjects($category: String, $endcursor: String) {
    projectSearch(first: 8, after: $endcursor, filter: {category: {eq: $category}}) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          title
          githubUrl
          description
          liveSiteUrl
          id
          image
          category
          createdBy {
            id
            email
            name
            avatarUrl
          }
        }
      }
    }
  }
`;
*/