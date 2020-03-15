/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'

import { Grommet, Box, Button, Text, Image, Main } from 'grommet'

import { theme } from './theme'
import { CreateProjectForm } from './components/NewProject/CreateProjectForm'
// import { Calendar as SprintPairingCalendar } from './components/SprintPairing/Calendar'
import { fetchProjects, createProject, fetchProject } from './api'
import { Timeline } from './components/SprintPairing/Timeline'
import { ProjectSelect } from './ProjectSelect'
import { getCurrentSprint, getFirstSprint } from './projectDateCalculations'

type PairingSchedulerAppState = {
  remote: RemoteDataStatus
  activeTabIndex: number
  projects: ProjectData[]
  engineers: Engineer[]
  project?: Project
  currentSprint?: Sprint
  selectProjectOpen: boolean
}

export default class App extends React.Component<{}, PairingSchedulerAppState> {
  state: PairingSchedulerAppState = {
    remote: 'loading',
    activeTabIndex: 0,
    projects: [],
    engineers: [],
    selectProjectOpen: false,
  }

  async componentDidMount() {
    await this.fetchProjectsData()
    const savedProject = localStorage.getItem('current-project')
    if (savedProject) {
      try {
        const savedProjectId = JSON.parse(savedProject).id
        this.handleSelectProject(
          this.state.projects.find(({ id }: ProjectData) => savedProjectId === id)
        )
      } catch (e) {
        // NoOp
      }
    }
  }

  fetchProjectsData = async () => {
    try {
      const result = await fetchProjects()

      switch (result.remote) {
        case 'success':
          this.setState({
            remote: 'success',
            ...result.data,
          })
          break
        case 'failure':
          this.setState({ remote: 'failure' })
      }
    } catch (e) {
      this.setState({ remote: 'failure' })
    }
  }

  handleSubmitCreateProject = async (submitData: {
    start_date: string
    engineer_names: string[]
    sprint_count: string
  }) => {
    try {
      const result = await createProject({
        ...submitData,
        sprint_count: parseInt(submitData.sprint_count),
      })

      switch (result.remote) {
        case 'success':
          this.setState({
            remote: 'success',
            projects: [...this.state.projects, { name: result.data.name, id: result.data.id }],
            project: result.data,
            activeTabIndex: this.state.projects.length + 1,
            currentSprint: getCurrentSprint(result.data) || getFirstSprint(result.data),
          })
          break
        case 'failure':
          this.setState({ remote: 'failure' })
      }
    } catch (e) {
      this.setState({ remote: 'failure' })
    }
  }

  handleSelectProject = async (project?: ProjectData) => {
    if (!project) {
      this.setState({ project })
    } else {
      try {
        const result = await fetchProject(project.id)

        switch (result.remote) {
          case 'success':
            this.setState({
              remote: 'success',
              project: result.data,
              currentSprint: getCurrentSprint(result.data) || getFirstSprint(result.data),
            })
            break
          case 'failure':
            this.setState({ remote: 'failure' })
        }
      } catch (e) {
        this.setState({ remote: 'failure' })
      }
    }
    localStorage.setItem('current-project', JSON.stringify(project))
  }

  render() {
    // TODO: add a UI for when remoteData is `failure` and when `loading`
    return (
      <Grommet theme={theme} full={true}>
        <Box
          align="center"
          margin="0 auto"
          pad={{ bottom: 'medium', top: 'large' }}
          width={{ max: 'medium' }}
        >
          <Image src="sprint-pairing.svg" fit="contain" />
          <Box pad="medium">
            <ProjectSelect
              allProjects={this.state.projects}
              project={this.state.project}
              setProject={this.handleSelectProject}
            />
          </Box>
        </Box>
        {this.state.project ? (
          <MainContent heading={this.state.project.name}>
            {this.state.currentSprint &&
              this.state.currentSprint.projectId === this.state.project.id &&
              this.state.project && <Timeline project={this.state.project} />}
          </MainContent>
        ) : (
          <MainContent heading="Create New Project">
            <CreateProjectForm
              engineers={this.state.engineers}
              onSubmit={this.handleSubmitCreateProject}
            />
          </MainContent>
        )}
      </Grommet>
    )
  }
}

const MainContent = ({ heading, children }: { heading: string; children: React.ReactNode }) => (
  <Main overflow="visible" pad={{ vertical: 'large' }}>
    <Box
      pad={{ bottom: 'xsmall' }}
      height={{ min: '50px' }}
      border="bottom"
      margin={{ bottom: 'medium', left: 'large' }}
    >
      <Text size="xxlarge">{heading}</Text>
    </Box>
    <Box pad={{ horizontal: 'small', bottom: 'medium' }} margin={{ left: 'large' }}>
      {children}
    </Box>
  </Main>
)
