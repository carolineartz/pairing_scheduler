/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'
import styled from 'styled-components'

import { theme } from './theme'
import { fetchProjects, createProject, fetchProject } from './api'
import { getCurrentSprint, getFirstSprint } from './projectDateCalculations'

import { Grommet, Box, Button, Text, Image, Main, ResponsiveContext, BoxProps } from 'grommet'

import { CreateProjectForm } from './components/NewProject/CreateProjectForm'
import { Timeline } from './components/SprintPairing/Timeline'
import { ProjectSelect } from './ProjectSelect'

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

  handleClickCreateProject = () => {
    this.setState({ project: undefined })
    localStorage.removeItem('current-project')
  }

  render() {
    return (
      <Grommet full theme={theme}>
        <ResponsiveContext.Consumer>
          {size => (
            <LayoutGrid size={size}>
              <LayoutHeader size={size}>
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
              </LayoutHeader>
              <LayoutCreateProject size={size}>
                <Box fill="vertical" align="center" justify="center" pad="medium">
                  <Button
                    primary
                    label="Create Project"
                    disabled={!this.state.project}
                    onClick={this.handleClickCreateProject}
                  />
                </Box>
              </LayoutCreateProject>
              <LayoutMain size={size} pad="small">
                {this.state.project ? (
                  <MainContent size={size} heading={this.state.project.name}>
                    {this.state.currentSprint &&
                      this.state.currentSprint.projectId === this.state.project.id &&
                      this.state.project && <Timeline project={this.state.project} />}
                  </MainContent>
                ) : (
                  <MainContent size={size} heading="Create New Project">
                    <CreateProjectForm
                      engineers={this.state.engineers}
                      onSubmit={this.handleSubmitCreateProject}
                    />
                  </MainContent>
                )}
              </LayoutMain>
            </LayoutGrid>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    )
  }
}

const MainContent = ({
  heading,
  children,
  size,
}: {
  heading: string
  children: React.ReactNode
  size: string
}) => (
  <Main
    overflow="visible"
    pad={size === 'small' ? 'medium' : size === 'medium' ? 'large' : 'xlarge'}
  >
    <Box height={{ min: '50px' }} border="bottom" margin={{ bottom: 'medium' }}>
      <Text size="xxlarge">{heading}</Text>
    </Box>
    <Box>{children}</Box>
  </Main>
)

type ResponsiveContextSize = 'small' | 'medium' | 'large'

type LayoutProps = BoxProps & {
  size: ResponsiveContextSize | string
}

const LayoutGrid = styled(Box)<LayoutProps>`
  height: 100vh;
  display: grid;
  grid-template-columns: 30% 1fr;
  grid-template-rows: ${props => (props.size === 'small' ? '20% 10% 1fr' : '30% 1fr')};
  grid-column-gap: 0px;
  grid-row-gap: 7px;
`

const LayoutHeader = styled(Box)<LayoutProps>`
  grid-area: 1 / 1 / 2 / 3;
`

const LayoutCreateProject = styled(Box)<LayoutProps>`
  grid-area: ${props => (props.size === 'small' ? '2 / 1 / 3 / 3' : '1 / 1 / 2 / 2')};
`

const LayoutMain = styled(Box)<LayoutProps>`
  grid-area: ${props => (props.size === 'small' ? '3 / 1 / 4 / 4' : '2 / 1 / 3 / 3')};
  main {
    overflow: scroll;
  }
`
