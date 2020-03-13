/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'
import styled from 'styled-components'
import { isWithinInterval } from 'date-fns/esm'
import {
  Grommet,
  Box,
  Button,
  Tabs,
  Tab,
  Text,
  Image,
  Main,
  ResponsiveContext,
  TabsProps,
} from 'grommet'

import { theme } from './theme'
import { CreateProjectForm } from './components/CreateProjectForm'
import { Calendar as SprintPairingCalendar } from './components/SprintPairing/Calendar'
import { fetchProjects, createProject, fetchProject } from './api'

type PairingSchedulerAppState = {
  remote: RemoteDataStatus
  activeTabIndex: number
  projects: Array<{ name: string; id: number }>
  engineers: Engineer[]
  project?: Project
  currentSprint?: Sprint
}

export default class App extends React.Component<{}, PairingSchedulerAppState> {
  state: PairingSchedulerAppState = {
    remote: 'loading',
    activeTabIndex: 0,
    projects: [],
    engineers: [],
  }

  componentDidMount() {
    this.fetchProjectsData()
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

  handleNavigateTab = async (nextIndex: number) => {
    if (nextIndex === 0) {
      this.fetchProjectsData()
      this.setState({ activeTabIndex: nextIndex })
    } else {
      try {
        const projectData = await fetchProject(this.state.projects[nextIndex - 1].id)

        switch (projectData.remote) {
          case 'success':
            this.setState({
              remote: 'success',
              project: projectData.data,
              currentSprint: getCurrentSprint(projectData.data) || getFirstSprint(projectData.data),
              activeTabIndex: nextIndex,
            })
            break
          case 'failure':
            this.setState({ remote: 'failure' })
        }
      } catch (e) {
        this.setState({ remote: 'failure' })
      }
    }
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
        </Box>
        <ResponsiveContext.Consumer>
          {size => (
            <Box pad={{ horizontal: 'large', vertical: 'small' }}>
              <ProjectListMenu
                size={size}
                activeIndex={this.state.activeTabIndex}
                onActive={this.handleNavigateTab}
              >
                <Tab
                  plain
                  title={
                    <Box pad={{ vertical: 'xsmall' }}>
                      <Button
                        as="div"
                        disabled={this.state.activeTabIndex === 0}
                        primary
                        onClick={(event: React.MouseEvent) => event.preventDefault()}
                        label="New Project"
                      />
                    </Box>
                  }
                >
                  <MainContent heading="Create New Project">
                    <CreateProjectForm
                      engineers={this.state.engineers}
                      onSubmit={this.handleSubmitCreateProject}
                    />
                  </MainContent>
                </Tab>
                {this.state.projects.map((project: { id: number; name: string }) => {
                  return (
                    <Tab key={`project-${project.id}`} title={project.name}>
                      <Box margin={{ top: 'medium' }}>
                        <MainContent heading={project.name}>
                          {this.state.currentSprint &&
                            this.state.currentSprint.projectId === project.id &&
                            this.state.project && (
                              <SprintPairingCalendar project={this.state.project} />
                            )}
                        </MainContent>
                      </Box>
                    </Tab>
                  )
                })}
              </ProjectListMenu>
            </Box>
          )}
        </ResponsiveContext.Consumer>
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

// Instead of doing routing for this small challenge, I used tabs. The Grommet tabs don't support vertical out of the box
// so some adjustments are made. Given more time I would like to improve this approach.
const ProjectListMenu = styled(Tabs)<TabsProps & { size: string }>`
  /* flex-direction: row; */
  flex-direction: ${props => (props.size === 'small' ? 'column' : 'row')};
  width: 100%;

  /* FIXME: this is ugly */
  [class*='StyledTabs__StyledTabsHeader'] {
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: normal;
    > button:first-child {
      text-align: center;
      margin: 0 auto 40px;
      width: 70%;
      min-width: 180px;
    }
  }

  [class*='StyledTabs__StyledTabPanel'] {
    flex-grow: 1;
  }
`

const getCurrentSprint = (project: Project): Sprint | undefined =>
  project.sprints.find((sprint: Sprint) =>
    isWithinInterval(Date.now(), { start: sprint.startDate, end: sprint.endDate })
  )
const getFirstSprint = (project: Project): Sprint => project.sprints[0]
