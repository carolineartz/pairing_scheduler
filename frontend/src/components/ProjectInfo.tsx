import * as React from 'react'

import { Calendar } from 'react-date-range'
import { Box } from 'grommet'
import { isWithinInterval, isWeekend, eachDayOfInterval } from 'date-fns/esm'

type ProjectInfoProps = {
  project?: Project
  activeSprint?: Sprint
}

type SingleDateRangeObject = {
  startDate: Date
  endDate: Date
  key: string
}

export const ProjectInfo = ({ project, activeSprint }: ProjectInfoProps) => {

  const CustomCalendar = Calendar as any
  let invalidDates: Date[] = []

  if (project) {
    invalidDates = eachDayOfInterval({
      start: project.startDate,
      end: project.endDate,
    }).filter((date: Date) => isWeekend(date))
  }

  const calculateDateRange = (sprint: Sprint): SingleDateRangeObject => ({
    startDate: sprint.startDate,
    endDate: sprint.endDate,
    key: 'selection',
  })

  const getDateRangesForProjectDate = (date: Date): SingleDateRangeObject | undefined => {
    const sprint =
      project &&
      project.sprints.find((sprint: Sprint) =>
        isWithinInterval(date, { start: sprint.startDate, end: sprint.endDate })
      )
    return sprint && calculateDateRange(sprint)
  }

  const getSprintForDate = (date: Date): Sprint | undefined =>
    project &&
    project.sprints.find((sprint: Sprint) =>
      isWithinInterval(date, { start: sprint.startDate, end: sprint.endDate })
    )

  const [selectedSprint, setSelectedSprint]: [
    Sprint | undefined,
    React.Dispatch<React.SetStateAction<undefined | Sprint>>
  ] = React.useState(activeSprint)

  const [dateRange, setDateRange]: [
    SingleDateRangeObject | undefined,
    React.Dispatch<React.SetStateAction<undefined | SingleDateRangeObject>>
  ] = React.useState()

  console.log("activeSprint", activeSprint)
  console.log("selectedSprint", selectedSprint)

  React.useEffect(() => {
    const sprintForDisplay = selectedSprint || activeSprint

    if (sprintForDisplay) {
      setDateRange(calculateDateRange(sprintForDisplay))
    } else {
      // FIXME: Shouldn't have to do this; consider a better way to conceptualize active/current sprint and date range display
      setDateRange(dateRange)
    }

    // need to trigger change for external component (tab switching) changes only
    // if the active sprint changes but can't compare on object
  }, [JSON.stringify(activeSprint), JSON.stringify(selectedSprint)])

  return (
    <Box >
      <Box align="start">
        {!activeSprint && <Box>dummy</Box>}
        {activeSprint && dateRange && project && (
          <CustomCalendar
            disabledDates={invalidDates}
            date={dateRange}
            showDateDisplay={false}
            moveRangeOnFirstSelection={true}
            ranges={dateRange ? [dateRange] : []}
            minDate={project.startDate}
            maxDate={project.endDate}
            displayMode="dateRange"
            onChange={(item: any) => {
              const sprint = getSprintForDate(item)
              if (sprint) {
                setSelectedSprint(sprint)
              }
            }}
          />
        )}
      </Box>
    </Box>
  )
}
