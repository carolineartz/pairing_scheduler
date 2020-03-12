/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'

import { Grommet, Box, Button, Tabs, Tab, Text, Heading, Image } from 'grommet'
import { ThemeType } from 'grommet/themes/base'
import { deepFreeze } from 'grommet/utils'
import { CreateProjectForm } from './components/CreateProjectForm'
import { ProjectInfo } from './components/ProjectInfo'
import { isWithinInterval } from 'date-fns/esm'

import { fetchProjects, createProject, fetchProject } from './api'

import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import styled from 'styled-components'

const theme: ThemeType = deepFreeze({
  global: {
    colors: {
      brand: '#81357D',
      'accent-1': '#bd53b8',
      'accent-2': '#500d4d',
      focus: '#bd53b8',
    },
    font: {
      family: 'Montserrat',
      size: '16px',
    },
  },
  formField: {
    label: {
      weight: 'bold',
    },
  },
  tab: {
    pad: 'small',
    margin: 'none',
    border: {
      active: {
        color: 'brand',
      },
      hover: {
        color: 'brand',
      },
    },
    active: {
      background: 'brand',
      color: 'white',
    },
    hover: {
      background: 'accent-1',
      color: 'white',
    }
  },
})

type PairingSchedulerAppState = {
  remote: RemoteDataStatus
  activeTabIndex: number
  projects: Array<{ name: string; id: number }>
  engineers: Engineer[]
  project?: Project
  currentSprint?: Sprint
}

const getCurrentSprint = (project: Project): Sprint | undefined =>
  project.sprints.find((sprint: Sprint) =>
    isWithinInterval(Date.now(), { start: sprint.startDate, end: sprint.endDate })
  )
const getFirstSprint = (project: Project): Sprint => project.sprints[0]

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
            activeTabIndex: this.state.projects.length,
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

  render() {
    console.log(this.state)

    return (
      <Grommet theme={theme} full={true}>
        <Box align="center" margin="30px auto 0" width={{ max: 'medium' }}>
          <Image src="sprint-pairing.svg" fit="contain" />
        </Box>
        <Box pad="large" direction="row" fill>
          <ProjectListMenu
            activeIndex={this.state.activeTabIndex}
            onActive={async (nextIndex: number) => {
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
                        currentSprint:
                          getCurrentSprint(projectData.data) || getFirstSprint(projectData.data),
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
            }}
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
              <Box
                pad={{ horizontal: 'small', bottom: 'medium' }}
                width={{ max: '70%' }}
                margin="0 auto"
              >
                <Text margin={{ bottom: 'medium' }} size="xxlarge">
                  Create New Project
                </Text>
                <CreateProjectForm
                  engineers={this.state.engineers}
                  onSubmit={this.handleSubmitCreateProject}
                />
              </Box>
            </Tab>
            {this.state.projects.map((project: { id: number; name: string }) => {
              return (
                <Tab
                  key={
                    this.state.currentSprint
                      ? `project-${project.id}-sprint-${this.state.currentSprint.id}`
                      : `project-${project.id}`
                  }
                  title={project.name}
                >
                  {this.state.currentSprint &&
                    this.state.currentSprint.projectId === project.id && (
                      <ProjectInfo
                        activeSprint={
                          this.state.project
                            ? getCurrentSprint(this.state.project) ||
                              getFirstSprint(this.state.project)
                            : undefined
                        }
                        project={this.state.project}
                      />
                    )}
                </Tab>
              )
            })}
          </ProjectListMenu>
        </Box>
      </Grommet>
    )
  }
}

const ProjectListMenu = styled(Tabs)`
  flex-direction: row;
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
