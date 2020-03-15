import * as React from 'react'

import { Calendar as RDRCalendar } from 'react-date-range'
import { Box, Text, ResponsiveContext } from 'grommet'

import { CalendarHeadingDisplay } from './SprintHeadingDisplay'
import { Engineers } from './Engineers'

import {
  SingleDateRangeObject,
  getSprintForDate,
  getCurrentSprint,
  getFirstSprint,
  calculateDateRange,
  getInvalidDates,
} from '../../projectDateCalculations'

type ProjectInfoProps = {
  project: Project
}

const CustomRDRCalendar = RDRCalendar as any

export const Calendar = ({ project }: ProjectInfoProps) => {
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
      <Box pad={{ bottom: 'xsmall' }} align="center">
        <CalendarHeadingDisplay
          setSelectedSprint={setSelectedSprint}
          selectedSprint={selectedSprint}
          project={project}
        />
      </Box>
      <Box direction="row" wrap={shouldWrap}>
        <Box width={{ min: '400px' }}>
          {dateRange && (
            <CustomRDRCalendar
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
            {selectedSprint.pairs.map(([eng1, eng2]: [Engineer, Engineer], index: number) => (
              <Engineers key={`${eng1.name}-${eng2.name}`} index={index}>
                <Text>{eng1.name}</Text>
                <Text>{eng2.name}</Text>
              </Engineers>
            ))}
            {selectedSprint.soloEngineer && (
              <Engineers>
                <Text>{selectedSprint.soloEngineer.name}</Text>
              </Engineers>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
