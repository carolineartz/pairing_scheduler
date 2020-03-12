import { default as axios, AxiosError } from 'axios'
import { parse as parseDate } from 'date-fns'

export type ProjectsResult = {
  remote: Extract<RemoteDataStatus, 'success'>
  data: {
    projects: Array<{ name: string; id: number }>
    engineers: Engineer[]
  }
}

export type ProjectResult = {
  remote: Extract<RemoteDataStatus, 'success'>
  data: Project
}

export type ErrorResult = {
  remote: Extract<RemoteDataStatus, 'failure'>
  error: ServerError
}

export const fetchProjects = async (): Promise<ProjectsResult | ErrorResult> => {
  try {
    const response = await axios.request<{
      projects: Array<{ name: string; id: number }>
      engineers: Engineer[]
    }>({
      url: '/api/projects',
    })
    return {
      remote: 'success',
      data: response.data,
    }
  } catch (error) {
    if (error && error.response) {
      const axiosError = error as AxiosError<ServerError>

      if (axiosError.response && axiosError.response.data) {
        return {
          remote: 'failure',
          error: axiosError.response.data,
        }
      }
    }
    throw error
  }
}

export const createProject = async (body: {
  start_date: string
  engineer_names: string[]
  sprint_count: number
}): Promise<ProjectResult | ErrorResult> => {
  try {
    const response = await axios.request<Project>({
      url: '/api/projects',
      method: 'POST',
      data: JSON.stringify(body),
      transformResponse: (resp: string) => projectFromResponse(JSON.parse(resp)),
    })
    return {
      remote: 'success',
      data: response.data,
    }
  } catch (error) {
    if (error && error.response) {
      const axiosError = error as AxiosError<ServerError>

      if (axiosError.response && axiosError.response.data) {
        return {
          remote: 'failure',
          error: axiosError.response.data,
        }
      }
    }
    throw error
  }
}

export const fetchProject = async (id: number): Promise<ProjectResult | ErrorResult> => {
  try {
    const response = await axios.request<Project>({
      url: `/api/projects/${id}`,
      transformResponse: (resp: string) => {
        return projectFromResponse(JSON.parse(resp))
      },
    })
    return {
      remote: 'success',
      data: response.data,
    }
  } catch (error) {
    if (error && error.response) {
      const axiosError = error as AxiosError<ServerError>

      if (axiosError.response && axiosError.response.data) {
        return {
          remote: 'failure',
          error: axiosError.response.data,
        }
      }
    }
    throw error
  }
}

const projectFromResponse = (projectData: ProjectResponseData): Project => ({
  id: projectData.id,
  name: projectData.name,
  startDate: parseDate(projectData.start_date, 'yyyy-MM-dd', new Date()),
  endDate: parseDate(projectData.end_date, 'yyyy-MM-dd', new Date()),
  sprints: projectData.sprints.map((sprintData: SprintResponseData) => ({
    id: sprintData.id,
    projectId: sprintData.project_id,
    startDate: parseDate(sprintData.start_date, 'yyyy-MM-dd', new Date()),
    endDate: parseDate(sprintData.end_date, 'yyyy-MM-dd', new Date()),
    soloEngineer: sprintData.solo_engineers[0] && sprintData.solo_engineers[0],
    pairs: sprintData.pairings.map(
      ({ members: [eng1, eng2] }: { members: [EngineerResponseData, EngineerResponseData] }) => [
        { name: eng1.name },
        { name: eng2.name },
      ]
    ),
  })),
})
