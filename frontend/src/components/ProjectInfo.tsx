import * as React from 'react'

import { Calendar } from 'react-date-range'
import { Box, Text, Image, ResponsiveContext } from 'grommet'
import { random } from 'lodash'

import { SprintHeadingDisplay } from './SprintHeadingDisplay'

import {
  SingleDateRangeObject,
  getSprintForDate,
  getCurrentSprint,
  getFirstSprint,
  calculateDateRange,
  getInvalidDates,
} from '../projectDateCalculations'

type ProjectInfoProps = {
  project: Project
}

const CustomCalendar = Calendar as any

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const initialSelectedSprint = (project: Project) =>
    getCurrentSprint(project) || getFirstSprint(project)

  const [selectedSprint, setSelectedSprint]: [
    Sprint,
    React.Dispatch<React.SetStateAction<Sprint>>
  ] = React.useState(initialSelectedSprint(project))

  const [dateRange, setDateRange]: [
    SingleDateRangeObject,
    React.Dispatch<React.SetStateAction<SingleDateRangeObject>>
  ] = React.useState(calculateDateRange(initialSelectedSprint(project)))

  // Because I'm avoiding routing byusing tabs, some adjustments are needed to make sure the content
  // on the tab updates when the project prop changes.
  React.useEffect(() => {
    let displaySprint: Sprint
    if (selectedSprint.projectId !== project.id) {
      displaySprint = initialSelectedSprint(project)
    } else {
      displaySprint = selectedSprint
    }

    setSelectedSprint(displaySprint)
    setDateRange(calculateDateRange(displaySprint))
  }, [project, selectedSprint])

  const size = React.useContext(ResponsiveContext)
  const shouldWrap = ['small', 'medium'].includes(size)

  return (
    <Box>
      <Box margin={{ bottom: 'large' }} pad={{ bottom: 'xsmall' }} border="bottom">
        <SprintHeadingDisplay
          setSelectedSprint={setSelectedSprint}
          selectedSprint={selectedSprint}
          project={project}
        />
      </Box>
      <Box direction="row" wrap={shouldWrap}>
        <Box width={{ min: '400px' }}>
          {dateRange && (
            <CustomCalendar
              disabledDates={getInvalidDates(project)}
              date={dateRange}
              showDateDisplay={false}
              showMonthArrow={false}
              showMonthAndYearPickers={false}
              moveRangeOnFirstSelection
              fixedHeight
              ranges={[dateRange]}
              minDate={project.startDate}
              maxDate={project.endDate}
              displayMode="dateRange"
              onChange={(date: any) => {
                const sprint = getSprintForDate(project, date)
                if (sprint) {
                  const dateRange = calculateDateRange(sprint)
                  setDateRange(dateRange)
                  setSelectedSprint(sprint)
                }
              }}
            />
          )}
        </Box>
        <Box pad={{ top: shouldWrap ? 'medium' : 'none' }} align="start">
          <Box direction="row" wrap>
            {selectedSprint.pairs.map(([eng1, eng2]: [Engineer, Engineer]) => (
              <EngDisplay key={`${eng1.name}-${eng2.name}`} imgSrc={getRandomPearPath()}>
                <Text>{eng1.name}</Text>
                <Text>{eng2.name}</Text>
              </EngDisplay>
            ))}
            {selectedSprint.soloEngineer && (
              <EngDisplay imgSrc="/apple.svg">
                <Text>{selectedSprint.soloEngineer.name}</Text>
              </EngDisplay>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const EngDisplay = ({ imgSrc, children }: { imgSrc: string; children: React.ReactNode }) => (
  <Box direction="row" pad="small" height={{ max: 'medium' }}>
    <Box justify="center">
      <Image width="50px" src={imgSrc} fit="contain" />
    </Box>
    <Box pad={{ horizontal: 'small' }} gap="xsmall" justify="center">
      {children}
    </Box>
  </Box>
)

export const getRandomPearPath = (): string => `/pear-${random(1, 6)}.svg`
