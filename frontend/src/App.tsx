/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react'

import { Grommet, Box, Button, Tabs, Tab } from 'grommet'
import { ThemeType } from 'grommet/themes/base'
import { deepFreeze } from 'grommet/utils'
import { CreateProjectForm } from './components/CreateProjectForm'

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
  activeTabIndex: number
  activeProject: Project | null
  projects: Project[]
  engineers: Engineer[]
}

export default class App extends React.Component<{}, PairingSchedulerAppState> {
  state = {
    activeTabIndex: 0,
    activeProject: null,
    projects: [],
    engineers: [],
  }

  componentDidMount() {
    fetch('api/projects')
      .then(resp => {
        resp
          .json()
          .then(
            ({
              projects,
              engineers,
            }: {
              projects: Array<{ name: string }>
              engineers: Array<{ name: string }>
            }) => {
              this.setState({ projects, engineers })
            }
          )
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleSubmitCreateProject = ({
    start_date,
    engineer_names,
    sprint_count,
  }: {
    start_date: string
    engineer_names: string[]
    sprint_count: string
  }) => {
    fetch('api/projects', {
      method: 'POST',
      body: JSON.stringify({
        start_date,
        engineer_names,
        // logic that its a string to begin with prob goes in the child component.
        sprint_count: parseInt(sprint_count),
      }),
    })
  }

  render() {
    console.log(this.state)
    return (
      <Grommet theme={theme} full={true}>
        <Box pad="medium" direction="row" fill>
          <ProjectListMenu
            activeIndex={this.state.activeTabIndex}
            onActive={(nextIndex: number) => this.setState({ activeTabIndex: nextIndex })}
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
            {this.state.projects.map((project: Project, i: number) => {
              return (
                <Tab key={`project-${i}`} title={project.name}>
                  <Box>This is a project!</Box>
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
