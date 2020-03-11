import { default as axios, AxiosError } from 'axios'

export type ProjectsResult = {
  remote: Extract<RemoteDataStatus, 'success'>
  data: {
    projects: Extract<Project, 'name'>[]
    engineers: Engineer[]
  }
}

export type ProjectResult = {
  remote: Extract<RemoteDataStatus, 'success'>
  data: Project[]
}

export type ErrorResult = {
  remote: Extract<RemoteDataStatus, 'failure'>
  error: ServerError
}

export const fetchProjects = async (): Promise<ProjectsResult | ErrorResult> => {
  try {
    const response = await axios.request<{
      projects: Extract<Project, 'name'>[]
      engineers: Engineer[]
    }>({
      url: `/api/projects`,

      // Both the JSON api endpoint and websocket return this structure
      // transformResponse: (resp: string) => fromResponse(JSON.parse(resp).data),
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

// export const createProject = async (): Promise<ProjectResult | ErrorResult> => {

// }

// export const fromResponse = (usersData: UserApiResponse[]): Array<UserAttrs> =>
//   usersData.map(
//     ({
//       display_name: displayName,
//       image_url: imageUrl,
//       time_zone: timeZone,
//       membership_status: membershipStatus,
//       bot: isBot,
//       ...restData
//     }: UserApiResponse): UserAttrs => ({
//       id: restData.id,
//       timeZone,
//       membershipStatus,
//       isBot,
//       title: restData.title,
//       phone: restData.phone,
//       skype: restData.skype,
//       name: restData.name,
//       displayName,
//       imageUrl,
//     })
//   )
