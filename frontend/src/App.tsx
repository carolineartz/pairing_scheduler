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

type Project = {
  name: string
}

type PairingSchedulerAppState = {
  activeTabIndex: number
  activeProject: Project | null
  projects: Project[]
}

export default class App extends React.Component<{}, PairingSchedulerAppState> {
  state = {
    activeTabIndex: 0,
    activeProject: null,
    projects: [
      {
        name: 'Project-1',
      },
    ],
  }

  componentDidMount() {
    console.log('mounted')
  }

  render() {
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
                <CreateProjectForm />
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
