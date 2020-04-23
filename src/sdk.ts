import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import {
  SdkFunctionWrapper,
  defaultWrapper
} from '@graphql-codegen/typescript-graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type CreateProjectInput = {
  name: Scalars['String'];
  key?: Maybe<Scalars['String']>;
};

export type CreateTaskInput = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  projectKey: Scalars['String'];
};

export type GetDefaultKeyInput = {
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createProject: Project;
  createTask: Task;
  userSignIn: Token;
  userSignOut: Token;
};

export type MutationCreateProjectArgs = {
  createProjectInput: CreateProjectInput;
};

export type MutationCreateTaskArgs = {
  createTaskInput: CreateTaskInput;
};

export type MutationUserSignInArgs = {
  password: Scalars['String'];
  name: Scalars['String'];
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ID'];
  name: Scalars['String'];
  key: Scalars['String'];
  tasks: Array<Task>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  projects: Array<Project>;
  defaultProjectKey: Scalars['String'];
  tasks: Array<Task>;
  self: User;
};

export type QueryDefaultProjectKeyArgs = {
  getDefaultKeyInput: GetDefaultKeyInput;
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['String'];
  sequence: Scalars['Float'];
  name: Scalars['String'];
  description: Scalars['String'];
  projectId: Scalars['String'];
  project: Project;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  key: Scalars['String'];
};

export type Token = {
  __typename?: 'Token';
  token: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type GetProjectsQueryVariables = {};

export type GetProjectsQuery = {
  __typename?: 'Query';
  projects: Array<{
    __typename?: 'Project';
    key: string;
    name: string;
    createdAt: any;
  }>;
};

export type GetProjectKeyQueryVariables = {
  name: Scalars['String'];
};

export type GetProjectKeyQuery = {
  __typename?: 'Query';
  defaultProjectKey: string;
};

export type CreateProjectMutationVariables = {
  createProjectInput: CreateProjectInput;
};

export type CreateProjectMutation = {
  __typename?: 'Mutation';
  createProject: { __typename?: 'Project'; key: string; name: string };
};

export type CreateTaskMutationVariables = {
  createTaskInput: CreateTaskInput;
};

export type CreateTaskMutation = {
  __typename?: 'Mutation';
  createTask: {
    __typename?: 'Task';
    name: string;
    key: string;
    project: { __typename?: 'Project'; name: string };
  };
};

export const GetProjectsDocument = gql`
  query getProjects {
    projects {
      key
      name
      createdAt
    }
  }
`;
export const GetProjectKeyDocument = gql`
  query getProjectKey($name: String!) {
    defaultProjectKey(getDefaultKeyInput: { name: $name })
  }
`;
export const CreateProjectDocument = gql`
  mutation createProject($createProjectInput: CreateProjectInput!) {
    createProject(createProjectInput: $createProjectInput) {
      key
      name
    }
  }
`;
export const CreateTaskDocument = gql`
  mutation createTask($createTaskInput: CreateTaskInput!) {
    createTask(createTaskInput: $createTaskInput) {
      name
      key
      project {
        name
      }
    }
  }
`;
export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    getProjects(
      variables?: GetProjectsQueryVariables
    ): Promise<GetProjectsQuery> {
      return withWrapper(() =>
        client.request<GetProjectsQuery>(print(GetProjectsDocument), variables)
      );
    },
    getProjectKey(
      variables: GetProjectKeyQueryVariables
    ): Promise<GetProjectKeyQuery> {
      return withWrapper(() =>
        client.request<GetProjectKeyQuery>(
          print(GetProjectKeyDocument),
          variables
        )
      );
    },
    createProject(
      variables: CreateProjectMutationVariables
    ): Promise<CreateProjectMutation> {
      return withWrapper(() =>
        client.request<CreateProjectMutation>(
          print(CreateProjectDocument),
          variables
        )
      );
    },
    createTask(
      variables: CreateTaskMutationVariables
    ): Promise<CreateTaskMutation> {
      return withWrapper(() =>
        client.request<CreateTaskMutation>(print(CreateTaskDocument), variables)
      );
    }
  };
}
