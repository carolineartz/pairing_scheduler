import * as React from 'react'
import { random } from 'lodash'
import { isWithinInterval, isWeekend, eachDayOfInterval, format as formatDate } from 'date-fns/esm'

import { Calendar } from 'react-date-range'
import { Box, Text, Image, ResponsiveContext } from 'grommet'

type ProjectInfoProps = {
  project: Project
}

type SingleDateRangeObject = {
  startDate: Date
  endDate: Date
  key: string
}
// The Calendar types definitions are not up-to-date. Without this hack I can't use the props I need.
// TODO: Submit a DefinitelyTyped
const CustomCalendar = Calendar as any

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const [selectedSprint, setSelectedSprint]: [
    Sprint,
    React.Dispatch<React.SetStateAction<Sprint>>
  ] = React.useState(initialSelectedSprint(project))

  let invalidDates: Date[] = []

  if (project) {
    invalidDates = eachDayOfInterval({
      start: project.startDate,
      end: project.endDate,
    }).filter((date: Date) => isWeekend(date))
  }

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
        <Text weight="bold" size="large">{`Sprint ${formatDate(
          selectedSprint.startDate,
          'M/d/yyyy'
        )} - ${formatDate(selectedSprint.endDate, 'M/d/yyyy')}`}</Text>
      </Box>
      <Box direction="row" wrap={shouldWrap}>
        <Box width={{ min: '400px' }}>
          {dateRange && (
            <CustomCalendar
              disabledDates={invalidDates}
              date={dateRange}
              showDateDisplay={false}
              moveRangeOnFirstSelection={true}
              ranges={[dateRange]}
              minDate={project.startDate}
              maxDate={project.endDate}
              displayMode="dateRange"
              onChange={(item: any) => {
                const sprint = getSprintForDate(project, item)
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

// TODO: move these to some type of helper.

const getRandomPearPath = (): string => `/pear-${random(1, 6)}.svg`

const getCurrentSprint = (project: Project): Sprint | undefined =>
  project.sprints.find((sprint: Sprint) =>
    isWithinInterval(Date.now(), { start: sprint.startDate, end: sprint.endDate })
  )
const getFirstSprint = (project: Project): Sprint => project.sprints[0]

const initialSelectedSprint = (project: Project) =>
  getCurrentSprint(project) || getFirstSprint(project)

const getSprintForDate = (project: Project, date: Date): Sprint | undefined =>
  project.sprints.find((sprint: Sprint) =>
    isWithinInterval(date, { start: sprint.startDate, end: sprint.endDate })
  )
const calculateDateRange = (sprint: Sprint): SingleDateRangeObject => ({
  startDate: sprint.startDate,
  endDate: sprint.endDate,
  key: 'selection',
})
