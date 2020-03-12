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

type Sprint = {
  id: number
  projectId: number
  startDate: Date
  endDate: Date
  soloEngineer?: Engineer
  pairs: Array<[Engineer, Engineer]>
}

type Project = {
  id: number
  name: string
  startDate: Date
  endDate: Date
  sprints: Sprint[]
}

type Engineer = {
  name: string
}