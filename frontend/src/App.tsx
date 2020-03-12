/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'

import { Grommet, Box, Button, Tabs, Tab, Text } from 'grommet'
import { ThemeType } from 'grommet/themes/base'
import { deepFreeze } from 'grommet/utils'
import { CreateProjectForm } from './components/CreateProjectForm'

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
})

type PairingSchedulerAppState = {
  remote: RemoteDataStatus
  activeTabIndex: number
  projects: Array<{ name: string; id: number }>
  engineers: Engineer[]
  project: Project | null
}

export default class App extends React.Component<{}, PairingSchedulerAppState> {
  state: PairingSchedulerAppState = {
    remote: 'loading',
    activeTabIndex: 0,
    projects: [],
    engineers: [],
    project: null,
  }

  componentDidMount() {
    this.fetchProjectsData()
  }

  fetchProjectsData = async () => {
    try {
      const result = await fetchProjects()

      switch (result.remote) {
        case 'success':
          this.setState({ remote: 'success', ...result.data })
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
        <Box pad="medium" direction="row" fill>
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
                <Button
                  as="span"
                  primary
                  onClick={(event: React.MouseEvent) => event.preventDefault()}
                  label="Create Project"
                />
              }
            >
              <Box pad="small" width="large" margin="auto">
                <CreateProjectForm
                  engineers={this.state.engineers}
                  onSubmit={this.handleSubmitCreateProject}
                />
              </Box>
            </Tab>
            {this.state.projects.map((project: { name: string }, i: number) => {
              return (
                <Tab key={`project-${i}`} title={project.name}>
                  <Box>{this.state.project && <Text>{this.state.project.name}</Text>}</Box>
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
  }

  [class*='StyledTabs__StyledTabPanel'] {
    flex-grow: 1;
  }
`
