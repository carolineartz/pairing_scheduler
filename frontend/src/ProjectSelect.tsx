import * as React from 'react'
import { Box, Select } from 'grommet'

type ProjectSelectProps = {
  allProjects: ProjectData[]
  setProject: Function
  project?: ProjectData
}

export const ProjectSelect = ({ allProjects, setProject, project }: ProjectSelectProps) => (
  <Select
    placeholder="Select Project"
    valueLabel={
      <Box width={{ min: 'medium' }} pad="small">
        {project ? project.name : 'Select Project'}
      </Box>
    }
    options={allProjects.map((project: { name: string }) => project.name)}
    onChange={(event: any) => {
      if (event && event.option) {
        setProject(allProjects.find((project: { name: string }) => project.name === event.value))
      }
    }}
  />
)
