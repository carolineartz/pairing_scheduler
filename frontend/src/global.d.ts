declare type RemoteDataStatus = 'loading' | 'success' | 'failure'

declare type ServerError = {
  error?: string
  message?: string
}

declare type EngineerResponseData = {
  id: number
  name: string
}

declare type PairingResponseData = {
  id: number
  members: EngineerResponseData[]
}

declare type SprintResponseData = {
  id: number
  start_date: string
  end_date: string
  project_id: number
  solo_engineers: EngineerResponseData[]
  pairings: {
    members: [EngineerResponseData, EngineerResponseData]
  }[]
}

declare type ProjectResponseData = {
  id: number
  name: string
  start_date: string
  end_date: string
  sprints: SprintResponseData[]
}

declare type Sprint = {
  id: number
  projectId: number
  startDate: Date
  endDate: Date
  soloEngineer?: Engineer
  pairs: Array<[Engineer, Engineer]>
}

declare type Project = {
  id: number
  name: string
  startDate: Date
  endDate: Date
  sprints: Sprint[]
}

declare type Engineer = {
  name: string
}


declare type ProjectsResult = {
  remote: Extract<RemoteDataStatus, 'success'>
  data: {
    projects: Array<{ name: string; id: number }>
    engineers: Engineer[]
  }
}

declare type ProjectResult = {
  remote: Extract<RemoteDataStatus, 'success'>
  data: Project
}

declare type ErrorResult = {
  remote: Extract<RemoteDataStatus, 'failure'>
  error: ServerError
}
