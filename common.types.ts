import { Types } from 'mongoose';
import { User, Session } from 'next-auth'

export type FormState = {
    title: string;
    description: string;
    image: string;
    liveSiteUrl: string;
    githubUrl: string;
    category: string;
};

export interface ProjectInterface {
    title: string;
    description: string;
    image: string;
    liveSiteUrl: string;
    githubUrl: string;
    category: string;
    updatedAt: string;
    _id: string;
    createdBy: {
      name: string;
      email: string;
      avatarUrl: string;
      _id: string;
    };
}

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    description: string | null;
    avatarUrl: string;
    githubUrl: string | null;
    linkedinUrl: string | null;
    projects: ProjectInterface[]
    // {
      // edges: { node: ProjectInterface }[];
      // pageInfo: {
      //   hasPreviousPage: boolean;
      //   hasNextPage: boolean;
      //   startCursor: string;
      //   endCursor: string;
      // };
    // };
}

export interface SessionInterface extends Session {
  user: User & {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

export interface ProjectForm {
  title: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
}

export interface UserType {
  name: string;
  email: string;
  avatarUrl?: string;
  description?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  projects?: string[]; // Assuming projects are stored as an array of project IDs
}

export interface IProject {
  title: string;
  description: string;
  image: string;
  liveSiteUrl: string;
  githubUrl: string;
  category: string;
  createdBy: Types.ObjectId | string; // Assuming you are using Types.ObjectId from mongoose
}