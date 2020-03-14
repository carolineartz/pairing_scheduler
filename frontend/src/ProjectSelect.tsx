import * as React from 'react'
import { Box, Select } from 'grommet'

type ProjectData = {
  id: number
  name: string
}

type ProjectSelectProps = {
  projects: ProjectData[]
  goToIndex: Function
  activeIndex: number
}

export const ProjectSelect = ({ projects, goToIndex, activeIndex }: ProjectSelectProps) => {
  const indexOfProject = (name: string) => {
    const index = projects.findIndex((project: ProjectData) => project.name === name)
    if (index >= 0) {
      return index + 1
    }
  }
  const allProjects = projects.map((project: ProjectData) => project.name)

  const onChange = (event?: any) => {
    if (event && event.option) {
      goToIndex(indexOfProject(event.option))
      setValue(event.value)
    }
    console.log(activeIndex)
  }

  const [value, setValue] = React.useState(activeIndex)

  const onClose = (event?: any) => {
    console.log('value', value)
    console.log('activeIndex', activeIndex)
    if (projects[value + 1]) {
      console.log('name at value + 1', projects[value + 1].name)
    }
  }

  const label = (
    <Box width={{ min: 'medium' }} pad="small">
      {projects[activeIndex - 1] ? projects[activeIndex - 1].name : 'Select Project'}
    </Box>
  )
  console.log(activeIndex)
  return (
    <Select
      placeholder="Select Project"
      onClose={onClose}
      valueLabel={label}
      options={allProjects}
      onChange={onChange}
    />
  )
}
